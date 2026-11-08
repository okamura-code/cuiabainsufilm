// Parked-car layer = the owner's garage-lit Porsche (hero-porsche-simulador-v2), cut with a ChatGPT alpha and placed on the
// simulator frame's 1500x750 canvas so its bbox matches the frame car (width and wheel line). node scripts/car-garage.mjs
// It sits on top of porsche-frente.webp while parked and fades out during the travel; the two renders differ a little, so the
// fade is where that difference is absorbed. Output: public/media/hero/porsche-frente-escuro.webp
import sharp from 'sharp';
const HERO = 'raw/pacote-2026-11-06/imagens/hero/hero-novo-carro-v2.webp', GPT = 'raw/porsche/hero2-car-cutout-gpt.png';
const CROP = { left: 960, top: 420, width: 480, height: 340 }, W = 1500, H = 750, FRAME = { x0: 252, x1: 1247, bottom: 689 };
const rgb = await sharp(HERO).resize(1915, 821, { fit: 'fill' }).extract(CROP).removeAlpha().raw().toBuffer();
const g = await sharp(GPT).resize(CROP.width, CROP.height, { fit: 'fill' }).ensureAlpha().raw().toBuffer();
let x0 = 1e9, x1 = 0, y0 = 1e9, y1 = 0, diff = 0, n = 0;
for (let y = 0; y < CROP.height; y++) for (let x = 0; x < CROP.width; x++) { const i = (y * CROP.width + x) * 4; if (g[i + 3] > 8) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } if (g[i + 3] > 250) { const j = (y * CROP.width + x) * 3; diff += Math.abs(g[i] - rgb[j]) + Math.abs(g[i + 1] - rgb[j + 1]) + Math.abs(g[i + 2] - rgb[j + 2]); n++; } }
console.log('alpha bbox in crop', { x0, y0, x1, y1 }, 'gpt rgb vs original mean diff', (diff / n / 3).toFixed(2));
// RGBA cutout (original pixels + gpt alpha), then scale/translate into the frame canvas
const cut = Buffer.alloc(CROP.width * CROP.height * 4);
for (let i = 0, j = 0; i < cut.length; i += 4, j += 3) { cut[i] = rgb[j]; cut[i + 1] = rgb[j + 1]; cut[i + 2] = rgb[j + 2]; cut[i + 3] = g[i + 3]; }
const s = (FRAME.x1 - FRAME.x0) / (x1 - x0);
const sw = Math.round(CROP.width * s), sh = Math.round(CROP.height * s);
const left = Math.round(FRAME.x0 - x0 * s), top = Math.round(FRAME.bottom - (y1 + 1) * s);
console.log('scale', s.toFixed(4), 'placed at', { left, top, sw, sh });
const scaledFull = sharp(cut, { raw: { width: CROP.width, height: CROP.height, channels: 4 } }).resize(sw, sh, { kernel: 'lanczos3' });
const cl = Math.max(0, -left), ct = Math.max(0, -top), cw = Math.min(sw - cl, W - Math.max(0, left)), ch = Math.min(sh - ct, H - Math.max(0, top));
const scaled = await scaledFull.extract({ left: cl, top: ct, width: cw, height: ch }).png().toBuffer(); // keep only what falls inside the canvas
const layer = sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite([{ input: scaled, left: Math.max(0, left), top: Math.max(0, top) }]);
await layer.clone().webp({ quality: 88, alphaQuality: 95 }).toFile('public/media/hero/porsche-frente-escuro.webp');
// proofs (composite first, then crop): parked car over the garage window; and the garage car (45 %) over the dimmed frame car
const win = { left: 970, top: 481, width: 469, height: 234 };
const bg = await sharp('public/media/hero/hero-vazio.webp').extract(win).resize(W, H).toBuffer();
const layerPng = await layer.clone().png().toBuffer();
const c1 = await sharp(bg).composite([{ input: layerPng }]).png().toBuffer();
await sharp(c1).extract({ left: 187, top: 0, width: 1125, height: 750 }).jpeg({ quality: 90 }).toFile('raw/review-v8/carro-garagem-dono.jpg');
const frame = await sharp('public/media/hero/porsche-frente.webp').modulate({ brightness: 0.6 }).png().toBuffer();
const half = await sharp(layerPng).composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#000" fill-opacity=".45"/></svg>`), blend: 'dest-in' }]).png().toBuffer();
const c2 = await sharp(bg).composite([{ input: frame }, { input: half }]).png().toBuffer();
await sharp(c2).extract({ left: 187, top: 0, width: 1125, height: 750 }).jpeg({ quality: 88 }).toFile('raw/review-v8/carro-garagem-dono-x-frame.jpg');
console.log('ok');
