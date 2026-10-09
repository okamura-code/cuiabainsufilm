// public/media/*.jpg -> .webp (max 1200w) + -640.webp for srcset; removes the jpg. node scripts/webp.mjs
import sharp from 'sharp';
import { readdirSync, unlinkSync, statSync } from 'node:fs';
const dir = 'public/media';
for (const f of readdirSync(dir).filter((f) => f.endsWith('.jpg'))) {
  const base = f.slice(0, -4);
  await sharp(`${dir}/${f}`).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`${dir}/${base}.webp`);
  await sharp(`${dir}/${f}`).resize({ width: 640 }).webp({ quality: 76 }).toFile(`${dir}/${base}-640.webp`);
  console.log(base, statSync(`${dir}/${f}`).size, '->', statSync(`${dir}/${base}.webp`).size, statSync(`${dir}/${base}-640.webp`).size);
  unlinkSync(`${dir}/${f}`);
}
