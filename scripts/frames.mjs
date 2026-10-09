// Per-tonality frames (generated externally) -> cropped WebP, with the burned-in corner label patched from the clean source photo.
// node scripts/frames.mjs <view>   e.g. lateral-esquerda
import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'node:fs';
const view = process.argv[2];
const src = readdirSync('raw/porsche').find((f) => f.startsWith(view + '.'));
const inDir = `raw/porsche/frames/${view}`, outDir = `public/media/porsche/frames/${view}`;
mkdirSync(outDir, { recursive: true });
const LABEL = { left: 0, top: 0.9, width: 0.24, height: 0.1 }; // label box, as fractions of the frame (bottom-left corner)
const CROP = { left: 0.0514, top: 0.117, width: 0.897, height: 0.797 }; // tight 2:1 box around the car, same for all four views
for (const f of readdirSync(inDir)) {
  const frame = sharp(`${inDir}/${f}`);
  const { width: w, height: h } = await frame.metadata();
  const box = { left: 0, top: Math.round(h * LABEL.top), width: Math.round(w * LABEL.width), height: h - Math.round(h * LABEL.top) };
  const patch = await sharp(`raw/porsche/${src}`).resize(w, h, { fit: 'fill' }).extract(box).toBuffer();
  const g = f.replace(/\.\w+$/, '');
  const crop = { left: Math.round(w * CROP.left), top: Math.round(h * CROP.top), width: Math.round(w * CROP.width), height: Math.round(h * CROP.height) };
  await sharp(await frame.composite([{ input: patch, left: box.left, top: box.top }]).toBuffer()).extract(crop).resize(1500).webp({ quality: 80 }).toFile(`${outDir}/${g}.webp`);
  console.log('ok', g, `${w}x${h}`);
}
// clean source photo with the same crop, used by the before/after comparator
{
  const { width: w, height: h } = await sharp(`raw/porsche/${src}`).metadata();
  const crop = { left: Math.round(w * CROP.left), top: Math.round(h * CROP.top), width: Math.round(w * CROP.width), height: Math.round(h * CROP.height) };
  await sharp(`raw/porsche/${src}`).extract(crop).resize(1500).webp({ quality: 80 }).toFile(`${outDir}/original.webp`);
  console.log('ok original');
}
