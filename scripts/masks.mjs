// Glass masks for the VLT simulator: loose polygon around the glass ∩ dark pixels (body is white).
// node scripts/masks.mjs  -> public/media/porsche/<view>.jpg + <view>-mask.png (black, alpha = glass)
import sharp from 'sharp';
const W = 1920, H = 1080, OUT = 1600, T = 185; // T: luminance below which a pixel inside the polygon counts as glass
const views = {
  'lateral-esquerda': { src: 'raw/porsche/lateral-esquerda.webp', poly: [[360,484],[370,400],[480,365],[650,350],[800,334],[985,322],[1050,342],[1150,382],[1250,423],[1330,455],[1345,484]] },
  'lateral-direita':  { src: 'raw/porsche/lateral-direita.jpg',  poly: [[640,472],[650,445],[700,410],[760,372],[810,340],[850,320],[1000,316],[1150,318],[1220,350],[1290,380],[1360,410],[1430,440],[1440,472]] },
  'frente':           { src: 'raw/porsche/frente.jpg',           poly: [[610,392],[628,300],[672,238],[725,214],[1205,214],[1258,238],[1302,300],[1335,392]] },
  'traseira':         { src: 'raw/porsche/traseira.jpg',         poly: [[690,395],[695,300],[720,235],[760,212],[1180,212],[1220,235],[1250,300],[1260,395]] },
};
const inside = (x, y, p) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const [xi, yi] = p[i], [xj, yj] = p[j]; if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
for (const [name, v] of Object.entries(views)) {
  const base = sharp(v.src).resize(W, H, { fit: 'cover' });
  const { data } = await base.clone().removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const mask = Buffer.alloc(W * H * 4);
  const [minY, maxY] = [Math.min(...v.poly.map((p) => p[1])), Math.max(...v.poly.map((p) => p[1]))];
  for (let y = minY; y <= maxY; y++) for (let x = 0; x < W; x++) {
    if (!inside(x, y, v.poly)) continue;
    const i = (y * W + x) * 3, lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    if (lum < T) mask[(y * W + x) * 4 + 3] = 255;
  }
  await sharp(mask, { raw: { width: W, height: H, channels: 4 } }).blur(1.2).resize(OUT).png({ compressionLevel: 9 }).toFile(`public/media/porsche/${name}-mask.png`);
  await base.clone().resize(OUT).jpeg({ quality: 82, mozjpeg: true }).toFile(`public/media/porsche/${name}.jpg`);
  console.log('ok', name);
}
