// Parked-car layer = the owner's transparent Porsche PNG (raw/porsche/porsche-dono-frontal.png), placed on the simulator
// frame's 1500x750 canvas so its bbox matches the frame car (width and wheel line). node scripts/car-garage.mjs
// It sits on top of porsche-frente.webp while parked and fades out during the travel into the frame render.
import sharp from 'sharp';
const SRC = 'raw/porsche/porsche-dono-frontal.png', W = 1500, H = 750, FRAME = { x0: 252, x1: 1247, bottom: 689 };
const { data: g, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let x0 = 1e9, x1 = 0, y0 = 1e9, y1 = 0;
for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) if (g[(y * info.width + x) * 4 + 3] > 8) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
const s = (FRAME.x1 - FRAME.x0) / (x1 - x0), sw = Math.round(info.width * s), sh = Math.round(info.height * s);
const left = Math.round(FRAME.x0 - x0 * s), top = Math.round(FRAME.bottom - (y1 + 1) * s);
console.log('src bbox', { x0, y0, x1, y1 }, 'scale', s.toFixed(4), 'placed', { left, top, sw, sh });
const cl = Math.max(0, -left), ct = Math.max(0, -top), cw = Math.min(sw - cl, W - Math.max(0, left)), ch = Math.min(sh - ct, H - Math.max(0, top));
const scaled = await sharp(SRC).resize(sw, sh, { kernel: 'lanczos3' }).extract({ left: cl, top: ct, width: cw, height: ch }).png().toBuffer();
const layer = sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite([{ input: scaled, left: Math.max(0, left), top: Math.max(0, top) }]);
await layer.clone().webp({ quality: 88, alphaQuality: 95 }).toFile('public/media/hero/porsche-frente-escuro.webp');
const win = { left: 970, top: 481, width: 469, height: 234 };
const bg = await sharp('public/media/hero/hero-vazio.webp').extract(win).resize(W, H).toBuffer();
const c1 = await sharp(bg).composite([{ input: await layer.clone().png().toBuffer() }]).png().toBuffer();
await sharp(c1).extract({ left: 187, top: 0, width: 1125, height: 750 }).jpeg({ quality: 90 }).toFile('raw/review-v8/carro-garagem-dono.jpg');
console.log('ok');
