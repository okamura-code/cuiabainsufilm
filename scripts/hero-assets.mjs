// Hero plates for the v8 opening. node scripts/hero-assets.mjs
// 1) fachada.webp: approved composition with ONLY the garage interior taken from the empty-garage plate (feathered mask).
// 2) fachada-hero.webp (hero v2, 08/11): crop to the building, sky keyed to graphite, alpha feather on the four edges so the
//    plate melts into the section background (#0f1114). No blur, no global darkening; sign, walls and ramp untouched.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
const SRC = 'raw/pacote-2026-11-06/imagens/hero/';
const OUT = 'public/media/hero/'; mkdirSync(OUT, { recursive: true });
const A = SRC + 'hero-aprovado.png', B = SRC + 'garagem-vazia-limpa.png';
const { width: W, height: H } = await sharp(A).metadata(); // 1670x942
const door = { left: 592, top: 402, width: 1066 - 592, height: 812 - 402 };
const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#000"/><rect x="${door.left}" y="${door.top}" width="${door.width}" height="${door.height}" fill="#fff"/></svg>`;
const mk = await sharp(Buffer.from(maskSvg)).blur(3).greyscale().raw().toBuffer({ resolveWithObject: true });
const mask = mk.data, MC = mk.info.channels;
const a = await sharp(A).removeAlpha().raw().toBuffer(), b = await sharp(B).removeAlpha().raw().toBuffer();
const plate = Buffer.alloc(W * H * 3);
for (let i = 0, p = 0; i < W * H; i++, p += 3) { const m = mask[i * MC] / 255; for (let c = 0; c < 3; c++) plate[p + c] = Math.round(a[p + c] * (1 - m) + b[p + c] * m); }
await sharp(plate, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 86 }).toFile(OUT + 'fachada.webp');
await sharp(plate, { raw: { width: W, height: H, channels: 3 } }).resize(1200).webp({ quality: 84 }).toFile(OUT + 'fachada-1200.webp');

// ---- hero v2 plate ----
const CROP = { left: 320, width: 1350 - 320 }; // black side fades end at x 339 / 1330
const CW = CROP.width, CH = H;
const TOP = [0x15, 0x17, 0x1a], BOT = [0x0f, 0x11, 0x14], SKY_BOTTOM = 740; // graphite gradient replaces the sky
// 1) sky key: how "blue sky" each pixel is (0..1), softened by a small blur so the edge of the sign has no fringe
const key = Buffer.alloc(CW * CH);
for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
  const p = (y * W + x + CROP.left) * 3, R = plate[p], G = plate[p + 1], Bl = plate[p + 2];
  const s = (Bl > G + 6 && Bl > 50 && y < SKY_BOTTOM) ? Math.min(1, Math.max(0, (Bl - R - 16) / 20)) : 0; // loose enough to catch the anti-aliased rim of the sign
  key[y * CW + x] = Math.round(s * 255);
}
const sk = await sharp(key, { raw: { width: CW, height: CH, channels: 1 } }).blur(1).raw().toBuffer({ resolveWithObject: true });
const softKey = sk.data, KC = sk.info.channels; // sharp may hand the blurred key back with more than one channel
// 2) edge feather (alpha): smoothstep ramps, left 14 %, right 6 %, top 8 %, bottom 10 %
const ss = (t) => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };
const out = Buffer.alloc(CW * CH * 4);
for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
  const p = (y * W + x + CROP.left) * 3, o = (y * CW + x) * 4, k = softKey[(y * CW + x) * KC] / 255;
  const g = Math.min(1, y / SKY_BOTTOM), gr = [TOP[0] + (BOT[0] - TOP[0]) * g, TOP[1] + (BOT[1] - TOP[1]) * g, TOP[2] + (BOT[2] - TOP[2]) * g];
  for (let c = 0; c < 3; c++) out[o + c] = Math.round(plate[p + c] * (1 - k) + gr[c] * k);
  const alpha = ss(x / (CW * 0.14)) * ss((CW - 1 - x) / (CW * 0.06)) * ss(y / (CH * 0.08)) * ss((CH - 1 - y) / (CH * 0.10));
  out[o + 3] = Math.round(alpha * 255);
}
const hero = sharp(out, { raw: { width: CW, height: CH, channels: 4 } });
await hero.clone().webp({ quality: 86, alphaQuality: 90 }).toFile(OUT + 'fachada-hero.webp');
await hero.clone().resize(900).webp({ quality: 84, alphaQuality: 90 }).toFile(OUT + 'fachada-hero-900.webp');
// proof: zooms over the section background colour
const bg = { r: 0x0f, g: 0x11, b: 0x14 };
const z = async (name, l, t, w, h) => sharp({ create: { width: w, height: h, channels: 4, background: bg } }).composite([{ input: await hero.clone().extract({ left: l, top: t, width: w, height: h }).png().toBuffer() }]).resize(w * 3, h * 3, { kernel: 'nearest' }).png().toFile(`raw/porsche/grid/hero2-${name}.png`);
await z('sign-top', 300, 0, 420, 110); await z('left-edge', 0, 380, 180, 200); await z('right-wall', 870, 240, 160, 160); await z('bottom', 420, 820, 300, 122);
console.log('ok hero plate', CW, CH, '| car canvas left %', ((630.5 - CROP.left) / CW * 100).toFixed(2), 'width %', (491.4 / CW * 100).toFixed(2));
