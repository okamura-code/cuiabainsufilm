/* Custom cursor (lime dot + ring, lerped) and magnetic buttons. Desktop with a mouse only, no reduced motion.
   The cursor node lives in <body>, which the view-transition router swaps, so it is rebuilt on astro:page-load. */
const ok = () =>
  (matchMedia('(pointer: fine)').matches || location.search.includes('feel=1')) &&
  matchMedia('(min-width: 900px)').matches &&
  !matchMedia('(prefers-reduced-motion: reduce)').matches;

let x = 0, y = 0, tx = 0, ty = 0, cursor: HTMLElement | null = null, magnet: HTMLElement | null = null, running = false;
const HOVER = 'a, button, summary, .filter, label.quiz__opt, .gp-item, .ba, input[type=range]';

function build() {
  if (!ok()) return;
  document.documentElement.classList.add('has-cursor');
  cursor = document.querySelector('.cursor');
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<i></i><span></span>';
    document.body.appendChild(cursor);
  }
  if (!running) { running = true; bind(); requestAnimationFrame(loop); }
}

function loop() {
  x += (tx - x) * 0.22;
  y += (ty - y) * 0.22;
  if (cursor) cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  requestAnimationFrame(loop);
}

function bind() {
  addEventListener('pointermove', (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!cursor) return;
    cursor.classList.add('is-on');
    const t = e.target as Element;
    const over = t.closest(HOVER);
    cursor.classList.toggle('is-hover', !!over);
    const label = over?.classList.contains('ba') ? 'Arraste' : over?.classList.contains('gp-item') ? 'Ver' : '';
    cursor.classList.toggle('is-label', !!label);
    (cursor.lastElementChild as HTMLElement).textContent = label;
    // magnetic: the button leans toward the pointer while hovered, eases back on leave
    const m = t.closest('[data-magnetic]') as HTMLElement | null;
    if (magnet && magnet !== m) { magnet.style.transform = ''; magnet = null; }
    if (m) {
      magnet = m;
      const r = m.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      m.style.transform = `translate(${(dx * 10).toFixed(1)}px, ${(dy * 8).toFixed(1)}px)`;
    }
  }, { passive: true });
  addEventListener('pointerdown', () => cursor?.classList.add('is-down'));
  addEventListener('pointerup', () => cursor?.classList.remove('is-down'));
  document.addEventListener('mouseleave', () => cursor?.classList.remove('is-on'));
  document.addEventListener('mouseenter', () => cursor?.classList.add('is-on'));
}

if (document.readyState === 'complete') build();
else addEventListener('load', build, { once: true });
document.addEventListener('astro:page-load', build);
