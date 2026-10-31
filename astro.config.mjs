// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// hellolifty.com is a custom domain served from the root of GitHub Pages. The deploy workflow sets SITE_URL and BASE_PATH
// (same as the Jumpy Dumpling site); locally they fall back to the dev server.
export default defineConfig({
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
