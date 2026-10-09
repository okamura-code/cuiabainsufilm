import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// shortcut: build.format 'file' + relative links so the preview also works as a Claude Artifact; switch to 'directory' and absolute links at production deploy
export default defineConfig({
  site: 'https://cuiabainsulfilm.com.br',
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: [sitemap()],
});
