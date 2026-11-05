/* Inertial scroll (Lenis) — desktop with a mouse only, never on touch, never with reduced motion.
   Loaded after `load` so it costs nothing on the critical path. Lenis scrolls the real window,
   so IntersectionObserver, position:sticky and CSS scroll-driven animations keep working. */
type LenisLike = { raf: (t: number) => void; scrollTo: (t: Element | number, o?: Record<string, unknown>) => void; resize: () => void };
let lenis: LenisLike | null = null;

// ?feel=1 forces the desktop effects on (used to test in emulated browsers that report a coarse pointer)
const ok = () =>
  (matchMedia('(pointer: fine)').matches || location.search.includes('feel=1')) &&
  matchMedia('(min-width: 900px)').matches &&
  !matchMedia('(prefers-reduced-motion: reduce)').matches;

async function start() {
  if (lenis || !ok()) return;
  const { default: Lenis } = await import('lenis');
  const l = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
  lenis = l as unknown as LenisLike;
  (window as unknown as { __lenis: LenisLike }).__lenis = lenis;
  const raf = (t: number) => { l.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  // in-page anchors: smooth to the target with the fixed header offset (capture: runs before the view-transition router)
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest('a[href]');
    if (!a || !lenis) return;
    const href = a.getAttribute('href') || '';
    const hash = href.startsWith('#') ? href : href.startsWith('/#') && location.pathname === '/' ? href.slice(1) : '';
    if (!hash || hash === '#') return;
    const el = document.querySelector(hash);
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    lenis.scrollTo(el, { offset: -68 });
    history.replaceState(null, '', hash);
  }, true);
}

if (document.readyState === 'complete') start();
else addEventListener('load', start, { once: true });

// after a client-side navigation the window is already at the new position: resync Lenis to it
document.addEventListener('astro:page-load', () => {
  if (!lenis) return;
  lenis.resize();
  lenis.scrollTo(window.scrollY, { immediate: true, force: true });
});
