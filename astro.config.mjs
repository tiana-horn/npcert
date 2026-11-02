// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.npcertificationacademy.com',
  output: 'static',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'always' },
  vite: { plugins: [tailwindcss()] },
});
