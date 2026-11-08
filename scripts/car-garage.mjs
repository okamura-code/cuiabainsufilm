// Garage-lit copy of the simulator car, geometry untouched. node scripts/car-garage.mjs
// Deterministic relight of porsche-frente.webp: vertical falloff (brighter roof, darker sills and wheels), slightly cooler and
// less saturated, both windows filled with the garage's darkness (seats and dash kept), soft side falloff. Same alpha, same pixels
// positions, so the hand-over to frente/g70 stays exact.
import sharp from 'sharp';
const SRC = 'public/media/hero/porsche-frente.webp', OUT = 'public/media/hero/porsche-frente-escuro.webp';
const { data: px, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const inside = (x, y, pg) => { let c = false; for (let i = 0, j = pg.length - 1; i < pg.length; j = i++) { const [xi, yi] = pg[i], [xj, yj] = pg[j]; if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
const windshield = [[495, 88], [1040, 88], [1075, 228], [455, 228]], rear = [[640, 122], [885, 122], [892, 180], [632, 180]];
const G = [0x14, 0x15, 0x17]; // garage back wall
const CAR = { top: 46, bottom: 689, cx: 750 };
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = (y * W + x) * 4; if (px[i + 3] === 0) continue;
  let R = px[i], Gr = px[i + 1], B = px[i + 2];
  const lum = 0.2126 * R + 0.7152 * Gr + 0.0722 * B, sat = Math.max(R, Gr, B) - Math.min(R, Gr, B);
  // windows: what shows through becomes garage-dark; seats/dash (already dark or saturated) stay
  if (inside(x, y, rear) && lum > 40 && sat < 70) { const k = Math.min(1, (lum - 40) / 30); R = R * (1 - k) + G[0] * k; Gr = Gr * (1 - k) + G[1] * k; B = B * (1 - k) + G[2] * k; }
  else if (inside(x, y, windshield) && lum > 95 && sat < 60) { const k = Math.min(1, (lum - 95) / 45) * 0.85; R = R * (1 - k) + G[0] * k; Gr = Gr * (1 - k) + G[1] * k; B = B * (1 - k) + G[2] * k; }
  // vertical falloff: downlights hit the roof and hood, sills and wheels sit in shade
  const v = Math.min(1, Math.max(0, (y - CAR.top) / (CAR.bottom - CAR.top)));
  let f = 0.86 - 0.34 * v * v; // 0.86 at the roof → 0.52 at the tyres
  const side = Math.abs(x - CAR.cx) / 500; f *= 1 - 0.08 * Math.min(1, side * side); // edges a touch darker
  // slight desaturation and a cool cast, like the grey concrete room
  const g = 0.2126 * R + 0.7152 * Gr + 0.0722 * B;
  R = (R * 0.85 + g * 0.15) * f * 0.98; Gr = (Gr * 0.85 + g * 0.15) * f; B = (B * 0.85 + g * 0.15) * f * 1.04;
  px[i] = Math.max(0, Math.min(255, Math.round(R))); px[i + 1] = Math.max(0, Math.min(255, Math.round(Gr))); px[i + 2] = Math.max(0, Math.min(255, Math.round(B)));
}
const img = sharp(px, { raw: { width: W, height: H, channels: 4 } });
await img.clone().webp({ quality: 88, alphaQuality: 95 }).toFile(OUT);
// proof: over the real garage window, with the ChatGPT v2 beside for comparison
const win = { left: 970, top: 481, width: 469, height: 234 };
const bg = await sharp('public/media/hero/hero-vazio.webp').extract(win).resize(1500, 750).toBuffer();
const comp = await sharp(bg).composite([{ input: await img.clone().png().toBuffer() }]).png().toBuffer();
const mine = await sharp(comp).extract({ left: 187, top: 0, width: 1125, height: 750 }).toBuffer();
const gpt = await sharp('raw/porsche/relight-gpt-v2.png').resize(1125, 750).toBuffer();
await sharp({ create: { width: 2270, height: 750, channels: 3, background: '#333' } }).composite([{ input: mine, left: 0, top: 0 }, { input: gpt, left: 1145, top: 0 }]).jpeg({ quality: 88 }).toFile('raw/review-v8/carro-garagem-processado-x-chatgpt.jpg');
await sharp(comp).extract({ left: 400, top: 60, width: 700, height: 240 }).resize(1400).jpeg({ quality: 90 }).toFile('raw/review-v8/carro-garagem-cabine-2x.jpg');
console.log('ok');
