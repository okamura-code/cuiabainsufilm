// Static map for "Como chegar": OpenStreetMap tiles around the shop (pin read from the Google Maps place page, 08/11/2026),
// stitched once at build time and recoloured to the site's graphite (roads light, blocks dark). node scripts/map.mjs
// Output: public/media/contact/mapa.webp (+ -900) and the pin position in %, printed for Contact.astro.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
const LAT = -15.6182954, LON = -56.0889233, Z = 16, COLS = 3, ROWS = 2, T = 256;
const n = 2 ** Z, xf = ((LON + 180) / 360) * n, yf = ((1 - Math.log(Math.tan((LAT * Math.PI) / 180) + 1 / Math.cos((LAT * Math.PI) / 180)) / Math.PI) / 2) * n;
const x0 = Math.floor(xf) - 1, y0 = Math.floor(yf) - 1; // pin lands in the middle column, just below centre
const tiles = [];
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
  const res = await fetch(`https://tile.openstreetmap.org/${Z}/${x0 + c}/${y0 + r}.png`, { headers: { 'User-Agent': 'cuiaba-insulfilm-site-build/1.0 (static map, one-off)' } });
  if (!res.ok) throw new Error(`tile ${res.status}`);
  tiles.push({ input: Buffer.from(await res.arrayBuffer()), left: c * T, top: r * T });
}
const W = COLS * T, H = ROWS * T;
const raw = await sharp({ create: { width: W, height: H, channels: 3, background: '#fff' } }).composite(tiles).greyscale().raw().toBuffer();
// levels: OSM background (~242) → graphite 0x1b, roads (255) → 0x6a; darker features (text, buildings, parks) → near black
const out = Buffer.alloc(W * H * 3);
for (let i = 0; i < W * H; i++) {
  const v = raw[i], t = Math.min(1, Math.max(0, (v - 226) / 29)), g = 0x14 + t * (0x6a - 0x14);
  out[i * 3] = Math.round(g * 0.96); out[i * 3 + 1] = Math.round(g); out[i * 3 + 2] = Math.round(g * 1.06); // cool graphite
}
mkdirSync('public/media/contact', { recursive: true });
const img = sharp(out, { raw: { width: W, height: H, channels: 3 } }).resize(W * 2, H * 2, { kernel: 'lanczos3' });
await img.clone().webp({ quality: 82 }).toFile('public/media/contact/mapa.webp');
await img.clone().resize(900).webp({ quality: 80 }).toFile('public/media/contact/mapa-900.webp');
console.log('pin % left/top', (((xf - x0) * T) / W * 100).toFixed(2), (((yf - y0) * T) / H * 100).toFixed(2), '| size', W * 2, H * 2);
