/* Hero 3D: SUV CC0 (Kenney) iluminado por um "sol" que vai do zênite ao horizonte com o scroll; o vidro escurece junto.
   Carrega Three.js só depois do load. Sem WebGL2 ou com reduced-motion a foto de poster fica. */
const PIN = '(min-width: 900px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)';
const MOBILE = '(max-width: 899px) and (prefers-reduced-motion: no-preference)';
let live: HTMLElement | null = null; // hero element currently driven (the router swaps <body> on navigation)
async function start() {
  const hero = document.getElementById('topo');
  const cv = hero?.querySelector<HTMLCanvasElement>('.hero__3d');
  if (!hero || !cv || hero === live) return;
  const desktop = matchMedia(PIN).matches, mobile = matchMedia(MOBILE).matches;
  if (!desktop && !mobile) return;
  if (!document.createElement('canvas').getContext('webgl2')) return;
  live = hero;
  const THREE = await import('three');
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
  const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');
  const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: desktop, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(desktop ? Math.min(devicePixelRatio, 2) : 1);
  renderer.shadowMap.enabled = desktop;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const sun = new THREE.DirectionalLight(0xffffff, 3); sun.castShadow = desktop; scene.add(sun);
  scene.add(new THREE.HemisphereLight(0xb4aea2, 0x0b0d10, 0.6));
  const ground = new THREE.Mesh(new THREE.CircleGeometry(12, 48), new THREE.MeshStandardMaterial({ color: 0x15181d, roughness: 0.35, metalness: 0.2 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = desktop; scene.add(ground);
  const draco = new DRACOLoader(); draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
  const loader = new GLTFLoader(); loader.setDRACOLoader(draco);
  const gltf = await loader.loadAsync('/3d/car.glb');
  const car = gltf.scene;
  // The model has one palette material: glass and body are texel ranges of its colour map (uv.x≈0.094 / yellow family).
  let tint: { value: number } | null = null;
  car.traverse((o) => {
    const m = o as import('three').Mesh; if (!m.isMesh) return;
    m.castShadow = desktop;
    const mat = m.material as import('three').MeshStandardMaterial;
    mat.roughness = 0.45; mat.metalness = 0.15;
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uTint = tint ??= { value: 0 };
      sh.uniforms.uBody = { value: new THREE.Vector3(0.08, 0.09, 0.11) };
      sh.fragmentShader = sh.fragmentShader
        .replace('void main() {', 'uniform float uTint; uniform vec3 uBody;\nvoid main() {')
        .replace('#include <map_fragment>', `#include <map_fragment>
  float isGlass = step(0.05, vMapUv.x) * step(vMapUv.x, 0.14) * step(0.75, vMapUv.y) * step(vMapUv.y, 0.91);
  float isBody = step(0.85, diffuseColor.r) * step(0.3, diffuseColor.g) * step(diffuseColor.b, 0.25); // linear space: sRGB (255,184,76) -> g 0.48
  float lum = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
  diffuseColor.rgb = mix(diffuseColor.rgb, uBody * (0.6 + lum * 0.8), isBody);
  diffuseColor.rgb = mix(diffuseColor.rgb, mix(diffuseColor.rgb, vec3(0.04, 0.05, 0.06), 0.9), isGlass * uTint);`);
    };
  });
  const box = new THREE.Box3().setFromObject(car); const size = box.getSize(new THREE.Vector3()); const s = 4.2 / size.z; car.scale.setScalar(s);
  car.position.y = -box.min.y * s; scene.add(car);
  let yaw = 0, mx = 0, my = 0;
  const p = () => { const span = hero.offsetHeight - innerHeight; return span > 0 ? Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / span)) : 0; };
  function resize() { const w = cv!.clientWidth, h = cv!.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  addEventListener('resize', resize); resize();
  if (desktop) addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
  else { let x0 = 0, y0 = yaw; cv.addEventListener('pointerdown', (e) => { x0 = e.clientX; y0 = yaw; }); cv.addEventListener('pointermove', (e) => { if (e.buttons) yaw = y0 + (e.clientX - x0) / 150; }); }
  const warm = new THREE.Color(0xff9a3c), white = new THREE.Color(0xffffff);
  const veil = hero.querySelector<HTMLElement>('.hero__veil');
  function frame() {
    if (!hero!.isConnected) return; // page swapped (astro:page-load restarts us)
    requestAnimationFrame(frame);
    if (hero!.getBoundingClientRect().bottom < 0) return; // hero scrolled away: skip the GPU work
    const t = p(); (window as any).__heroP = t;
    if (veil) veil.style.opacity = String(1 - t);
    const a = Math.PI / 2 - t * 1.25; sun.position.set(Math.cos(a) * 8, Math.sin(a) * 8 + 0.5, 4); sun.color.copy(white).lerp(warm, t); sun.intensity = 3 - t * 1.6;
    if (tint) tint.value = t;
    car.rotation.y = -0.6 + t * 0.6 + yaw;
    if (desktop) { cam.position.set(6 + mx * 0.8, 1.6 + my * 0.4, 6); cam.lookAt(-1, 0.6, 1); } // aim left of the car so it sits right of the headline
    else { cam.position.set(11, 3, 11); cam.lookAt(0, -1.6, 0); } // portrait: pull back so the whole car fits, and raise it above the headline
    renderer.render(scene, cam);
  }
  frame(); cv.classList.add('is-on');
}
if (document.readyState === 'complete') start(); else addEventListener('load', start, { once: true });
// astro:page-load also fires on first load, before `load`: only act on it once the page is complete.
document.addEventListener('astro:page-load', () => { if (document.readyState === 'complete') start(); });
