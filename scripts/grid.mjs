// Draw a labelled coordinate grid over an image region (tracing aid for masks). node scripts/grid.mjs <in> <out> [left top width height] [step]
import sharp from 'sharp';
const [inp, out, l = "0", t = "0", w = "0", h = "0", st = "50", sc = "2"] = process.argv.slice(2);
const meta = await sharp(inp).metadata();
const box = { left: +l, top: +t, width: +w || meta.width - +l, height: +h || meta.height - +t };
const step = +st, S = +sc;
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${box.width * S}" height="${box.height * S}">`;
for (let x = Math.ceil(box.left / step) * step; x <= box.left + box.width; x += step) { const X = (x - box.left) * S; svg += `<line x1="${X}" y1="0" x2="${X}" y2="${box.height * S}" stroke="${x % (step * 2) ? '#0ff' : '#f0f'}" stroke-width="1" opacity=".7"/><text x="${X + 2}" y="12" font-size="11" fill="#ff0" font-family="monospace">${x % (step * 2) ? "" : x}</text>`; }
for (let y = Math.ceil(box.top / step) * step; y <= box.top + box.height; y += step) { const Y = (y - box.top) * S; svg += `<line x1="0" y1="${Y}" x2="${box.width * S}" y2="${Y}" stroke="${y % (step * 2) ? '#0ff' : '#f0f'}" stroke-width="1" opacity=".7"/><text x="2" y="${Y - 2}" font-size="11" fill="#ff0" font-family="monospace">${y % (step * 2) ? "" : y}</text>`; }
svg += '</svg>';
await sharp(inp).extract(box).resize(box.width * S, box.height * S, { kernel: 'lanczos3' }).composite([{ input: Buffer.from(svg), left: 0, top: 0 }]).jpeg({ quality: 88 }).toFile(out);
console.log('ok', out, box);
