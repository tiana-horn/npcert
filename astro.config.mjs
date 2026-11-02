// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.npcertificationacademy.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/book'),
      // Wix static hosting serves pages at their file path only.
      serialize: (item) => ({ ...item, url: new URL(item.url).pathname === '/' ? item.url : `${item.url}.html` }),
    }),
  ],
  build: { inlineStylesheets: 'always', format: 'file' },
  vite: { plugins: [tailwindcss()] },
});
