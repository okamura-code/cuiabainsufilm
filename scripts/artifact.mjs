// Build a Claude Artifact-friendly copy of the home page (no document wrapper): node scripts/artifact.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
mkdirSync('dist-artifact', { recursive: true });
const html = readFileSync('dist/index.html', 'utf8')
  .replace(/<!doctype html>/i, '')
  .replace(/<\/?html[^>]*>/gi, '')
  .replace(/<\/?head>/gi, '')
  .replace(/<\/?body[^>]*>/gi, '')
  .replace(/<title>[^<]*<\/title>/, '<title>Cuiabá Insulfilm</title>'); // short artifact name
writeFileSync('dist-artifact/index.html', html.trim());
console.log('ok dist-artifact/index.html');
