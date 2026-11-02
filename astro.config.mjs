// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.npcertificationacademy.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'always', format: 'file' },
  vite: { plugins: [tailwindcss()] },
});
