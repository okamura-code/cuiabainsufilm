/* Raio-X do vidro (#calor): SUV CC0 (Kenney) em Three.js. O inline script de HeatFacts.astro publica o progresso em
   section.dataset.p e dispara 'xray:p'; aqui só se desenha. Ato 1: raios atravessam o vidro e a cabine esquenta;
   ato 2: a película escurece o vidro; ato 3: os raios param no vidro e a cabine esfria.
   Three.js só depois do load. Sem WebGL (ou reduced-motion) o SVG estático fica. */
const PIN = '(min-width: 900px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)';
const MOBILE = '(max-width: 899px) and (prefers-reduced-motion: no-preference)';
let live: HTMLElement | null = null; // section currently driven (one instance per page; the router swaps <body>)

async function start() {
  const sec = document.getElementById('calor');
  const cv = sec?.querySelector<HTMLCanvasElement>('.xray__3d');
  if (!sec || !cv || sec === live) return;
  const desktop = matchMedia(PIN).matches;
  if (!desktop && !matchMedia(MOBILE).matches) return;
  live = sec;
  const ac = new AbortController(), { signal } = ac;
  let renderer: import('three').WebGLRenderer | null = null, raf = 0, io: IntersectionObserver | null = null;
  const trash: { dispose(): void }[] = []; // geometries/materials/textures freed on kill
  const kill = () => { ac.abort(); cancelAnimationFrame(raf); io?.disconnect(); trash.forEach((d) => d.dispose()); renderer?.dispose(); renderer?.forceContextLoss(); renderer = null; if (live === sec) live = null; };
  document.addEventListener('astro:before-swap', kill, { once: true, signal });

  let THREE: typeof import('three');
  let gltf: import('three/examples/jsm/loaders/GLTFLoader.js').GLTF;
  try {
    THREE = await import('three');
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: desktop, alpha: true, powerPreference: 'low-power' });
    gltf = await new GLTFLoader().loadAsync('/3d/car.glb');
  } catch {
    sec.dataset.noGl = ''; // CSS drops the pin, HeatFacts stops the acts: static SVG + the 3 paragraphs
    kill(); live = sec; // kill() clears `live`; set it back so astro:page-load does not retry on this page
    return;
  }
  if (signal.aborted) { kill(); return; } // page swapped while loading
  renderer.setPixelRatio(desktop ? Math.min(devicePixelRatio, 2) : 1);
  renderer.shadowMap.enabled = desktop;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(24, 1, 0.1, 100);
  const sunDir = new THREE.Vector3(0.35, 0.9, 0.55).normalize(); // from the car toward the sun: rays seen from the side
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.6); sun.position.copy(sunDir).multiplyScalar(8); sun.castShadow = desktop; scene.add(sun);
  if (desktop) sun.shadow.mapSize.set(1024, 1024);
  scene.add(new THREE.HemisphereLight(0xb4aea2, 0x0b0d10, 0.6));
  const ground = new THREE.Mesh(new THREE.CircleGeometry(12, 48), new THREE.MeshStandardMaterial({ color: 0x15181d, roughness: 0.35, metalness: 0.2 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = desktop; scene.add(ground);

  const car = gltf.scene;
  // One palette material: glass and body are texel ranges of its colour map (palette regions: see the shader patch below in xray3d.ts).
  const tint = { value: 0 }, heat = { value: 0 };
  car.traverse((o) => {
    const m = o as import('three').Mesh; if (!m.isMesh) return;
    m.castShadow = desktop;
    const mat = m.material as import('three').MeshStandardMaterial;
    if (mat.map) { mat.map.minFilter = mat.map.magFilter = THREE.NearestFilter; mat.map.generateMipmaps = false; mat.map.needsUpdate = true; trash.push(mat.map); } // palette: no blending across the step() edges
    mat.roughness = 0.45; mat.metalness = 0.15;
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uTint = tint; sh.uniforms.uHeat = heat;
      sh.uniforms.uBody = { value: new THREE.Vector3(0.08, 0.09, 0.11) };
      sh.fragmentShader = sh.fragmentShader
        .replace('void main() {', 'uniform float uTint; uniform float uHeat; uniform vec3 uBody;\nvoid main() {')
        .replace('#include <map_fragment>', `#include <map_fragment>
  float isGlass = step(0.05, vMapUv.x) * step(vMapUv.x, 0.14) * step(0.75, vMapUv.y) * step(vMapUv.y, 0.91);
  float isBody = step(0.85, diffuseColor.r) * step(0.3, diffuseColor.g) * step(diffuseColor.b, 0.25); // linear space yellow family
  float lum = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
  diffuseColor.rgb = mix(diffuseColor.rgb, uBody * (0.6 + lum * 0.8), isBody);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.03, 0.07, 0.04), 0.9 * uTint * isGlass); // dark green film`)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
  totalEmissiveRadiance += vec3(1.0, 0.36, 0.08) * uHeat * isGlass * 2.0 * (1.0 - 0.9 * uTint); // hot cabin seen through the glass`);
    };
  });
  const box = new THREE.Box3().setFromObject(car), size = box.getSize(new THREE.Vector3()), s = 4.2 / size.z;
  car.scale.setScalar(s); car.position.y = -box.min.y * s; scene.add(car);
  box.setFromObject(car); box.getSize(size);

  // 5 sun rays: from outside (upper right) through the near side window into the cabin.
  const OUT = 4.5, IN = 1.2;
  const rayMat = new THREE.MeshBasicMaterial({ color: 0xff8c28, transparent: true, opacity: 0.5, depthWrite: false, depthTest: false }); // x-ray: the part inside the cabin shows through the body
  const rayGeo = new THREE.CylinderGeometry(0.03, 0.03, 1, 6, 1, true).rotateX(Math.PI / 2).translate(0, 0, 0.5); // spans local z 0..1
  const hot = new THREE.MeshBasicMaterial({ color: 0xff8c28, depthTest: false });
  const tipGeo = new THREE.SphereGeometry(0.06, 12, 8);
  const rays = [-0.32, -0.16, 0, 0.16, 0.32].map((f, i) => {
    const hit = new THREE.Vector3(box.max.x * 0.9, box.min.y + size.y * (0.66 + (i % 2) * 0.06), f * size.z);
    const ray = new THREE.Mesh(rayGeo, rayMat);
    ray.position.copy(hit).addScaledVector(sunDir, OUT);
    ray.lookAt(hit); ray.renderOrder = 1; scene.add(ray);
    const tip = new THREE.Mesh(tipGeo, hot); tip.renderOrder = 1; scene.add(tip); // ray end: in the cabin, then held at the glass
    return { ray, tip, hit };
  });
  // the hot front seat, seen through the body
  const seatMat = new THREE.MeshBasicMaterial({ color: 0xff8c28, transparent: true, opacity: 0, depthTest: false, depthWrite: false });
  const seatGeo = new THREE.BoxGeometry(size.x * 0.3, size.y * 0.32, size.z * 0.14);
  const seat = new THREE.Mesh(seatGeo, seatMat); seat.renderOrder = 1;
  seat.position.set(size.x * 0.2, box.min.y + size.y * 0.42, size.z * 0.05); scene.add(seat);
  trash.push(rayGeo, rayMat, hot, tipGeo, seatMat, seatGeo);

  const resize = () => { const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h || !renderer) return; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  if (desktop) cam.position.set(8.4, 3, -5); else cam.position.set(9.4, 3.4, -5.6);
  cam.lookAt(0, 0.75, 0.1);
  const k = (a: number, b: number, p: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
  function draw() {
    raf = 0;
    if (!renderer) return;
    const p = Number(sec!.dataset.p || 0);
    const h = p < 0.36 ? 0.15 + 0.85 * k(0, 0.33, p) : 1 - k(0.36, 0.8, p); // cabin heats in act 1, cools in act 3
    heat.value = h; seatMat.opacity = 0.7 * h;
    tint.value = k(0.33, 0.66, p);
    const stop = k(0.66, 0.85, p), len = OUT + IN * (1 - stop); // act 3: rays pull back to the glass and hold
    rayMat.opacity = 0.5 - 0.3 * stop;
    rays.forEach((r) => { r.ray.scale.z = len; r.tip.position.copy(r.hit).addScaledVector(sunDir, OUT - len); });
    renderer.render(scene, cam);
  }
  let visible = false;
  const dirty = () => { if (visible && !raf) raf = requestAnimationFrame(draw); };
  io = new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; if (visible) dirty(); else { cancelAnimationFrame(raf); raf = 0; } });
  io.observe(sec);
  sec.addEventListener('xray:p', dirty, { signal });
  addEventListener('resize', () => { resize(); dirty(); }, { passive: true, signal });
  cv.addEventListener('webglcontextlost', () => cv.classList.remove('is-on'), { signal }); // GPU reset: show the SVG fallback
  resize(); draw(); cv.classList.add('is-on');
}
// Three.js only when the section is within ~1.5 screens: keeps it off the load window (TBT on mobile).
function arm() {
  const sec = document.getElementById('calor');
  if (!sec) return;
  const near = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { near.disconnect(); start(); } }, { rootMargin: '150% 0px' });
  near.observe(sec);
  document.addEventListener('astro:before-swap', () => near.disconnect(), { once: true });
}
if (document.readyState === 'complete') arm(); else addEventListener('load', arm, { once: true });
// astro:page-load also fires on first load, before `load`: only act on it once the page is complete.
document.addEventListener('astro:page-load', () => { if (document.readyState === 'complete') arm(); });
