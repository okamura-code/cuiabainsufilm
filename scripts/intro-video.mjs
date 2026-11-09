// Opening video for the stage: node scripts/intro-video.mjs
// raw/videos/abertura-logo.mp4 (untouched) -> public/media/hero/abertura.mp4 (1280x720), abertura-celular.mp4 (logo crop,
// ~1.06:1) and abertura-poster.webp (last frame, also the no-autoplay fallback). Muted: autoplay only works without sound.
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
const SRC = 'raw/videos/abertura-logo.mp4', OUT = 'public/media/hero/';
const enc = ['-c:v', 'libx264', '-crf', '24', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an'];
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', SRC, '-vf', 'scale=1280:720', ...enc, `${OUT}abertura.mp4`]);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', SRC, '-vf', 'crop=1150:1080:385:0,scale=720:676', ...enc, `${OUT}abertura-celular.mp4`]);
const last = execFileSync('ffmpeg', ['-v', 'error', '-sseof', '-0.1', '-i', `${OUT}abertura.mp4`, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], { maxBuffer: 64e6 });
await sharp(last).webp({ quality: 80 }).toFile(`${OUT}abertura-poster.webp`);
console.log('written: abertura.mp4, abertura-celular.mp4, abertura-poster.webp');
