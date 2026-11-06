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
  const kill = () => { ac.abort(); cancelAnimationFrame(raf); io?.disconnect(); renderer?.dispose(); renderer?.forceContextLoss(); renderer = null; if (live === sec) live = null; };
  document.addEventListener('astro:before-swap', kill, { once: true, signal });

  const THREE = await import('three');
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
  let gltf: import('three/examples/jsm/loaders/GLTFLoader.js').GLTF;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: desktop, alpha: true, powerPreference: 'low-power' });
    gltf = await new GLTFLoader().loadAsync('/3d/car.glb');
  } catch { kill(); live = sec; return; } // no WebGL / model failed: keep the SVG, do not retry on this page
  if (signal.aborted) { kill(); return; } // page swapped while loading
  renderer.setPixelRatio(desktop ? Math.min(devicePixelRatio, 2) : 1);
  renderer.shadowMap.enabled = desktop;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const sunDir = new THREE.Vector3(0.9, 1.1, -1.3).normalize(); // from the car toward the sun: upper right of the frame
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.6); sun.position.copy(sunDir).multiplyScalar(8); sun.castShadow = desktop; scene.add(sun);
  scene.add(new THREE.HemisphereLight(0xb4aea2, 0x0b0d10, 0.6));
  const ground = new THREE.Mesh(new THREE.CircleGeometry(12, 48), new THREE.MeshStandardMaterial({ color: 0x15181d, roughness: 0.35, metalness: 0.2 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = desktop; scene.add(ground);

  const car = gltf.scene;
  // One palette material: glass and body are texel ranges of its colour map (see hero3d reference).
  const tint = { value: 0 }, heat = { value: 0 };
  car.traverse((o) => {
    const m = o as import('three').Mesh; if (!m.isMesh) return;
    m.castShadow = desktop;
    const mat = m.material as import('three').MeshStandardMaterial;
    if (mat.map) { mat.map.minFilter = mat.map.magFilter = THREE.NearestFilter; mat.map.generateMipmaps = false; mat.map.needsUpdate = true; } // palette: no blending across the step() edges
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
  diffuseColor.rgb = mix(diffuseColor.rgb, mix(diffuseColor.rgb, vec3(0.04, 0.05, 0.06), 0.9), isGlass * uTint);`)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
  totalEmissiveRadiance += vec3(1.0, 0.36, 0.08) * uHeat * isGlass * 0.8 * (1.0 - uTint); // hot cabin seen through the glass, muted by the film`);
    };
  });
  const box = new THREE.Box3().setFromObject(car), size = box.getSize(new THREE.Vector3()), s = 4.2 / size.z;
  car.scale.setScalar(s); car.position.y = -box.min.y * s; scene.add(car);
  box.setFromObject(car); box.getSize(size);

  // 5 sun rays: from outside (upper right) through the near side window into the cabin.
  const OUT = 4.5, IN = 1.3;
  const rayMat = new THREE.MeshBasicMaterial({ color: 0xff8c28, transparent: true, opacity: 0.5, depthWrite: false, depthTest: false }); // x-ray: the part inside the cabin shows through the body
  const rayGeo = new THREE.CylinderGeometry(0.018, 0.018, 1, 6, 1, true).rotateX(Math.PI / 2).translate(0, 0, 0.5); // spans local z 0..1
  const rays = [-0.32, -0.16, 0, 0.16, 0.32].map((f, i) => {
    const hit = new THREE.Vector3(box.max.x * 0.9, box.min.y + size.y * (0.66 + (i % 2) * 0.06), f * size.z);
    const ray = new THREE.Mesh(rayGeo, rayMat);
    ray.position.copy(hit).addScaledVector(sunDir, OUT);
    ray.lookAt(hit); ray.renderOrder = 1; scene.add(ray); return ray;
  });
  const glow = new THREE.PointLight(0xff6a1f, 0, 1, 2);
  glow.position.set(0, box.min.y + size.y * 0.7, 0); scene.add(glow);

  const resize = () => { const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h || !renderer) return; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  const k = (a: number, b: number, p: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
  function draw() {
    raf = 0;
    if (!renderer) return;
    const p = Number(sec!.dataset.p || 0);
    const h = p < 0.33 ? k(0, 0.33, p) : 1 - k(0.66, 1, p); // cabin heats in act 1, cools in act 3
    heat.value = h; glow.intensity = h * 9;
    tint.value = k(0.33, 0.66, p);
    const len = OUT + IN * (1 - k(0.66, 1, p)); // act 3: rays stop at the glass
    rays.forEach((r) => { r.scale.z = len; });
    if (desktop) { cam.position.set(8.4, 3, -5); cam.lookAt(0, 0.75, 0.1); }
    else { cam.position.set(9.4, 3.4, -5.6); cam.lookAt(0, 0.75, 0.1); }
    renderer.render(scene, cam);
  }
  let visible = false;
  const dirty = () => { if (visible && !raf) raf = requestAnimationFrame(draw); };
  io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) dirty(); else { cancelAnimationFrame(raf); raf = 0; } });
  io.observe(sec);
  sec.addEventListener('xray:p', dirty, { signal });
  addEventListener('resize', () => { resize(); dirty(); }, { passive: true, signal });
  resize(); draw(); cv.classList.add('is-on');
}
if (document.readyState === 'complete') start(); else addEventListener('load', start, { once: true });
// astro:page-load also fires on first load, before `load`: only act on it once the page is complete.
document.addEventListener('astro:page-load', () => { if (document.readyState === 'complete') start(); });
