// Car layer for the hero travel, cut from the owner's hero composition itself. node scripts/hero-car.mjs
// RGB = hero-composicao.webp pixels; alpha = ChatGPT background removal of the 480x340 crop at (960,420), aligned at 0,0.
// The layer canvas is a 2:1 window placed so the car sits where it sits in the simulator frame (alpha bbox x 252–1247,
// y 46–689 of 1500x750): the end-of-travel crossfade into frente/g70 then lines up.
import sharp from 'sharp';
const HERO = 'public/media/hero/hero-composicao.webp', GPT = 'raw/porsche/hero-car-cutout-gpt.png';
const CROP = { left: 960, top: 420, width: 480, height: 340 };
const { width: HW, height: HH } = await sharp(HERO).metadata();
const rgb = await sharp(HERO).removeAlpha().raw().toBuffer();
const g = await sharp(GPT).resize(CROP.width, CROP.height, { fit: 'fill' }).ensureAlpha().raw().toBuffer();
let x0 = 1e9, x1 = 0, y0 = 1e9, y1 = 0;
for (let y = 0; y < CROP.height; y++) for (let x = 0; x < CROP.width; x++) { if (g[(y * CROP.width + x) * 4 + 3] > 8) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } }
const car = { x0: x0 + CROP.left, x1: x1 + CROP.left, y0: y0 + CROP.top, y1: y1 + CROP.top }; // in hero px
const carW = car.x1 - car.x0;
const win = { w: carW / (995 / 1500) }; win.h = win.w / 2; win.l = car.x0 - (252 / 1500) * win.w; win.t = car.y0 - (46 / 750) * win.h;
const W = Math.round(win.w), H = Math.round(win.h), L = Math.round(win.l), T = Math.round(win.t);
const out = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const hx = L + x, hy = T + y, o = (y * W + x) * 4;
  if (hx < 0 || hy < 0 || hx >= HW || hy >= HH) continue;
  const j = (hy * HW + hx) * 3, cx = hx - CROP.left, cy = hy - CROP.top;
  const a = (cx >= 0 && cy >= 0 && cx < CROP.width && cy < CROP.height) ? g[(cy * CROP.width + cx) * 4 + 3] : 0;
  out[o] = rgb[j]; out[o + 1] = rgb[j + 1]; out[o + 2] = rgb[j + 2]; out[o + 3] = a;
}
await sharp(out, { raw: { width: W, height: H, channels: 4 } }).resize(W * 2, H * 2, { kernel: 'lanczos3' }).webp({ quality: 90, alphaQuality: 95 }).toFile('public/media/hero/porsche-hero.webp');
await sharp(out, { raw: { width: W, height: H, channels: 4 } }).resize(W * 3, H * 3, { kernel: 'nearest' }).flatten({ background: '#444' }).jpeg({ quality: 88 }).toFile('raw/review-v8/hero-car-layer-3x.jpg');
console.log(JSON.stringify({ carBBox: car, window: { left: L, top: T, width: W, height: H }, pct: { left: +(L / HW * 100).toFixed(3), top: +(T / HH * 100).toFixed(3), width: +(W / HW * 100).toFixed(3) } }));
