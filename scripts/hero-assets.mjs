// Hero plates for the v8 opening. node scripts/hero-assets.mjs
// Facade = approved composition (sign colours approved) with ONLY the garage interior taken from the empty-garage plate,
// blended through a feathered rectangle that stays inside the dark interior (both plates are dark there, so the seam hides).
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
const SRC = 'raw/pacote-2026-11-06/imagens/hero/';
const OUT = 'public/media/hero/'; mkdirSync(OUT, { recursive: true });
const A = SRC + 'hero-aprovado.png', B = SRC + 'garagem-vazia-limpa.png';
const { width: W, height: H } = await sharp(A).metadata(); // 1670x942
// interior of the door opening (traced on raw/porsche/grid/hero-door.jpg), inset 6 px from the white jambs and the lintel
const door = { left: 592, top: 402, width: 1066 - 592, height: 812 - 402 };
const FEATHER = 3; // sigma; ~8 px soft edge
const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#000"/><rect x="${door.left}" y="${door.top}" width="${door.width}" height="${door.height}" fill="#fff"/></svg>`;
const mask = await sharp(Buffer.from(maskSvg)).blur(FEATHER).greyscale().raw().toBuffer();
const a = await sharp(A).removeAlpha().raw().toBuffer(), b = await sharp(B).removeAlpha().raw().toBuffer();
const out = Buffer.alloc(W * H * 3);
for (let i = 0, p = 0; i < mask.length; i++, p += 3) { const m = mask[i] / 255; for (let c = 0; c < 3; c++) out[p + c] = Math.round(a[p + c] * (1 - m) + b[p + c] * m); }
const img = sharp(out, { raw: { width: W, height: H, channels: 3 } });
await img.clone().webp({ quality: 86 }).toFile(OUT + 'fachada.webp');
await img.clone().resize(1200).webp({ quality: 84 }).toFile(OUT + 'fachada-1200.webp');
await img.clone().png().toFile('raw/pacote-2026-11-06/imagens/hero/fachada-v8.png'); // lossless reference
// seam check: zoom on the four edges of the blend rectangle, lossless
const z = (name, l, t, w, h) => img.clone().extract({ left: l, top: t, width: w, height: h }).resize(w * 3, h * 3, { kernel: 'nearest' }).png().toFile(`raw/porsche/grid/seam-${name}.png`);
await z('top-left', 560, 370, 200, 120); await z('bottom-right', 960, 740, 160, 120); await z('bottom-left', 560, 740, 160, 120);
console.log('ok fachada', W, H);
