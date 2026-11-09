// Splits the black-backed logo into two alpha layers for the opening intro: white (car outline + CUIABÁ) and lime
// (INSULFILM + SOM E ACESSÓRIOS). node scripts/logo-layers.mjs  -> public/media/hero/logo-{branca,lima}{,-640}.webp
// Alpha = pixel luminance (keeps the antialiasing); the colour mask decides which layer a pixel belongs to.
import sharp from 'sharp';
const DIR = 'public/media/hero/';
for (const suf of ['', '-640']) {
  const { data, info } = await sharp(`${DIR}logo${suf}.webp`).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info, n = W * H;
  const out = { branca: Buffer.alloc(n * 4), lima: Buffer.alloc(n * 4) };
  const peak = { branca: 1, lima: 1 }, key = (r, g, b) => (g > r * 0.95 && g > b * 1.3 ? 'lima' : 'branca'); // hue, not brightness: dark lime edges stay lime
  for (let i = 0; i < n; i++) { const r = data[i * C], g = data[i * C + 1], b = data[i * C + 2], l = Math.max(r, g, b); if (l >= 12) peak[key(r, g, b)] = Math.max(peak[key(r, g, b)], l); }
  for (let i = 0; i < n; i++) {
    const r = data[i * C], g = data[i * C + 1], b = data[i * C + 2], lum = Math.max(r, g, b);
    if (lum < 12) continue;
    const k = key(r, g, b), a = lum / peak[k], o = out[k], j = i * 4; // alpha from luminance, full colour at the layer's peak
    o[j] = Math.min(255, r / a); o[j + 1] = Math.min(255, g / a); o[j + 2] = Math.min(255, b / a); o[j + 3] = Math.round(a * 255);
  }
  for (const k of Object.keys(out)) {
    await sharp(out[k], { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 90, alphaQuality: 95 }).toFile(`${DIR}logo-${k}${suf}.webp`);
    console.log(`logo-${k}${suf}.webp`, W, H);
  }
}
