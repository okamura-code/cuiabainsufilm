// Poster candidates for the two result videos. node scripts/video-posters.mjs            -> 3 sharp frames each + contact sheet
//                                               node scripts/video-posters.mjs --pick resultado-hatch=2 cuidado-interior=1 -> posters
// Frames come from raw/videos (never modified), 1 per second, scored by Laplacian deviation (sharpness), dark frames dropped,
// picks at least 20 % of the duration apart. Output is 720x1280 (sources are 9:16; pad would only kick in otherwise).
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
const IDS = ['resultado-hatch', 'cuidado-interior'], OUT = 'raw/review-v8/posters/', W = 720, H = 1280;
mkdirSync(OUT, { recursive: true });
const pick = Object.fromEntries(process.argv.slice(process.argv.indexOf('--pick') + 1 || 99).map((a) => a.split('=')));
if (process.argv.includes('--pick')) {
  for (const [id, n] of Object.entries(pick)) await sharp(`${OUT}${id}-${n}.jpg`).webp({ quality: 82 }).toFile(`public/media/results/${id}-poster.webp`);
  console.log('posters written', pick); process.exit(0);
}
for (const id of IDS) {
  const src = `raw/videos/${id}.mp4`, tmp = `${OUT}tmp-${id}/`; rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp);
  const dur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src]).toString());
  execFileSync('ffmpeg', ['-v', 'error', '-i', src, '-vf', `fps=1,scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2`, '-q:v', '2', `${tmp}f-%03d.jpg`]);
  const frames = [];
  for (const f of readdirSync(tmp).sort()) {
    const g = sharp(tmp + f).greyscale();
    const mean = (await g.clone().stats()).channels[0].mean;
    const lap = (await g.clone().convolve({ width: 3, height: 3, kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0] }).stats()).channels[0].stdev;
    frames.push({ f, t: parseInt(f.slice(2, 5)) - 1, mean, lap });
  }
  const chosen = [];
  for (const fr of frames.filter((x) => x.mean > 40).sort((a, b) => b.lap - a.lap)) {
    if (chosen.every((c) => Math.abs(c.t - fr.t) >= dur * 0.2)) chosen.push(fr);
    if (chosen.length === 3) break;
  }
  chosen.sort((a, b) => a.t - b.t);
  const tiles = [];
  for (const [i, c] of chosen.entries()) {
    await sharp(tmp + c.f).jpeg({ quality: 90 }).toFile(`${OUT}${id}-${i + 1}.jpg`);
    const label = Buffer.from(`<svg width="360" height="640"><rect width="360" height="48" fill="#000a"/><text x="14" y="33" font-family="Arial" font-size="24" fill="#fff">${i + 1}  ·  ${c.t}s</text></svg>`);
    tiles.push({ input: await sharp(tmp + c.f).resize(360, 640).composite([{ input: label }]).toBuffer(), left: i * 376, top: 0 });
  }
  await sharp({ create: { width: 376 * 3 - 16, height: 640, channels: 3, background: '#111' } }).composite(tiles).jpeg({ quality: 88 }).toFile(`${OUT}${id}-opcoes.jpg`);
  rmSync(tmp, { recursive: true, force: true });
  console.log(id, `${dur.toFixed(1)}s`, chosen.map((c) => `${c.t}s lap=${c.lap.toFixed(1)}`).join(' | '));
}
