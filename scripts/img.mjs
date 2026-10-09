// Resize generated PNGs to web JPGs: node scripts/img.mjs <inDir> <outDir>
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
const [, , inDir, outDir] = process.argv;
for (const f of readdirSync(inDir).filter((f) => f.endsWith('.png'))) {
  const out = `${outDir}/${f.replace(/\.png$/, '.jpg')}`;
  await sharp(`${inDir}/${f}`).resize({ width: 1920, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  console.log('ok', out);
}
