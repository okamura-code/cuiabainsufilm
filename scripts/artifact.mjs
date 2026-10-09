// Build a Claude Artifact-friendly copy of the home page (no document wrapper): node scripts/artifact.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
mkdirSync('dist-artifact', { recursive: true });
const page = process.argv[2] || 'index'; // node scripts/artifact.mjs [page]
const html = readFileSync(`dist/${page}.html`, 'utf8')
  .replace(/<!doctype html>/i, '')
  .replace(/<\/?html[^>]*>/gi, '')
  .replace(/<\/?head>/gi, '')
  .replace(/<\/?body[^>]*>/gi, '')
  .replace(/<title>[^<]*<\/title>/, (page === 'index' ? '<title>Cuiabá Insulfilm</title>' : '<title>Cuiabá Insulfilm Prévia</title>')); // short artifact name
writeFileSync(`dist-artifact/${page}.html`, html.trim());
console.log(`ok dist-artifact/${page}.html`);
