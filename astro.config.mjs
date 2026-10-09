import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// directory format + absolute links: clean URLs on Vercel (the Claude Artifact preview is retired)
export default defineConfig({
  site: 'https://cuiabainsulfilm.com.br',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [sitemap()],
});
