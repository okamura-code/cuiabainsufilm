// Empty-garage version of the hero composition. node scripts/hero-empty.mjs
// Only a feathered rectangle around the car (inside the dark garage interior) comes from the ChatGPT removal;
// every other pixel is the owner's hero-composicao.webp, so sign, walls, edges and colours do not move.
import sharp from 'sharp';
const HERO = 'public/media/hero/hero-composicao.webp', GPT = 'raw/porsche/hero-sem-carro-gpt.png';
const { width: W, height: H } = await sharp(HERO).metadata();
const a = await sharp(HERO).removeAlpha().raw().toBuffer();
const b = await sharp(GPT).resize(W, H, { fit: 'fill' }).removeAlpha().raw().toBuffer();
const box = { left: 1025, top: 468, width: 1385 - 1025, height: 722 - 468 }; // car bbox x 1049–1360, y 495–707, with margin; all inside the interior
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#000"/><rect x="${box.left}" y="${box.top}" width="${box.width}" height="${box.height}" rx="14" fill="#fff"/></svg>`;
const mk = await sharp(Buffer.from(svg)).blur(4).greyscale().raw().toBuffer({ resolveWithObject: true });
const m = mk.data, MC = mk.info.channels;
const out = Buffer.alloc(W * H * 3);
let diffOut = 0, nOut = 0;
for (let i = 0, p = 0; i < W * H; i++, p += 3) {
  const k = m[i * MC] / 255;
  for (let c = 0; c < 3; c++) out[p + c] = Math.round(a[p + c] * (1 - k) + b[p + c] * k);
  if (k === 0) { diffOut += Math.abs(a[p] - b[p]); nOut++; }
}
const img = sharp(out, { raw: { width: W, height: H, channels: 3 } });
await img.clone().webp({ quality: 88 }).toFile('public/media/hero/hero-vazio.webp');
await img.clone().resize(1200).webp({ quality: 84 }).toFile('public/media/hero/hero-vazio-1200.webp');
await img.clone().extract({ left: 940, top: 300, width: 540, height: 460 }).resize(1080).jpeg({ quality: 88 }).toFile('raw/review-v8/hero-vazio-garagem-2x.jpg');
console.log('ok hero-vazio', W, H, '| gpt vs original outside the patch (mean R diff):', (diffOut / nOut).toFixed(2));
