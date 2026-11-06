// Car layer for the v8 opening. node scripts/car-cutout.mjs
// Input: the ChatGPT background-removal PNG (raw/porsche/cutout-gpt-1774.png) and the simulator frame it was made from
// (public/media/porsche/frames/frente/g70.webp, 1500x750, already cropped by frames.mjs: NO crop is reapplied here).
// ChatGPT may redraw pixels, so only its ALPHA is used, after checking alignment; the RGB comes from the original frame.
import sharp from 'sharp';
const FRAME = 'public/media/porsche/frames/frente/g70.webp', GPT = 'raw/porsche/cutout-gpt-1774.png', OUT = 'public/media/hero/porsche-frente.webp';
const fm = await sharp(FRAME).metadata();
if (fm.width !== 1500 || fm.height !== 750) throw new Error('frame is not 1500x750: ' + fm.width + 'x' + fm.height);
const W = 1500, H = 750;
const frame = await sharp(FRAME).removeAlpha().raw().toBuffer();
const gpt = await sharp(GPT).resize(W, H, { fit: 'fill' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const g = gpt.data;
// 1) alignment: compare GPT RGB with the frame inside the opaque area, trying small shifts
const score = (dx, dy) => { let s = 0, n = 0; for (let y = 40; y < H - 40; y += 2) for (let x = 40; x < W - 40; x += 2) { const i = (y * W + x) * 4; if (g[i + 3] < 250) continue; const j = ((y + dy) * W + (x + dx)) * 3; s += Math.abs(g[i] - frame[j]) + Math.abs(g[i + 1] - frame[j + 1]) + Math.abs(g[i + 2] - frame[j + 2]); n++; } return s / n / 3; };
let best = { d: 1e9 }; for (let dy = -12; dy <= 12; dy += 2) for (let dx = -12; dx <= 12; dx += 2) { const d = score(dx, dy); if (d < best.d) best = { d, dx, dy }; }
console.log('best shift', best, 'diff at 0,0:', score(0, 0).toFixed(2));
// 2) alpha bbox + stats
let x0 = W, x1 = 0, y0 = H, y1 = 0, opaque = 0, soft = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const a = g[(y * W + x) * 4 + 3]; if (a > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } if (a > 250) opaque++; else if (a > 8) soft++; }
console.log('alpha bbox', { x0, y0, x1, y1 }, 'opaque px', opaque, 'soft px', soft);
// 3) build the layer: original frame RGB + GPT alpha (shifted by the best offset)
const out = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const o = (y * W + x) * 4, j = (y * W + x) * 3;
  const sx = x - best.dx, sy = y - best.dy; // alpha sampled where GPT drew the car for this frame pixel
  const a = (sx >= 0 && sx < W && sy >= 0 && sy < H) ? g[(sy * W + sx) * 4 + 3] : 0;
  out[o] = frame[j]; out[o + 1] = frame[j + 1]; out[o + 2] = frame[j + 2]; out[o + 3] = a;
}
const layer = sharp(out, { raw: { width: W, height: H, channels: 4 } });
await layer.clone().webp({ quality: 90, alphaQuality: 95 }).toFile(OUT);
await layer.clone().png().toFile('raw/porsche/porsche-frente-layer.png');
// 4) proof sheets: edges at 3x over a mid-grey, and GPT-vs-frame RGB diff where opaque
const bg = { r: 90, g: 90, b: 90 };
const zoom = async (name, l, t, w, h) => sharp({ create: { width: w, height: h, channels: 4, background: bg } }).composite([{ input: await layer.clone().extract({ left: l, top: t, width: w, height: h }).png().toBuffer() }]).resize(w * 3, h * 3, { kernel: 'nearest' }).png().toFile(`raw/porsche/grid/edge-${name}.png`);
await zoom('mirror-left', 250, 170, 160, 110); await zoom('mirror-right', 1110, 170, 160, 110); await zoom('wheel-left', 230, 560, 200, 150); await zoom('wheel-right', 1060, 560, 200, 150); await zoom('roof', 420, 40, 300, 80);
const diff = Buffer.alloc(W * H * 3); let dsum = 0, dn = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 4, j = (y * W + x) * 3; if (g[i + 3] < 250) { diff[j] = diff[j + 1] = diff[j + 2] = 0; continue; } const d = (Math.abs(g[i] - frame[j]) + Math.abs(g[i + 1] - frame[j + 1]) + Math.abs(g[i + 2] - frame[j + 2])) / 3; dsum += d; dn++; const v = Math.min(255, d * 4); diff[j] = v; diff[j + 1] = v; diff[j + 2] = v; }
await sharp(diff, { raw: { width: W, height: H, channels: 3 } }).jpeg({ quality: 80 }).toFile('raw/porsche/grid/gpt-vs-frame-diff.jpg');
console.log('GPT RGB vs frame (opaque area, no shift) mean diff', (dsum / dn).toFixed(2));
