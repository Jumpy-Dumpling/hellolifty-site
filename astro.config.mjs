// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// hellolifty.com is a custom domain served from the root of GitHub Pages, so the address is fixed here: always https, never localhost,
// and never taken from the environment (GitHub Pages reports http:// for a custom domain until HTTPS is enforced).
const lastmod = new Date().toISOString();

export default defineConfig({
  site: 'https://hellolifty.com',
  base: '/',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404/'),
      // Priorities hint at what matters most: the home page, then pricing and the features hub, then the individual pages.
      serialize(item) {
        const path = new URL(item.url).pathname;
        item.lastmod = lastmod;
        item.changefreq = path === '/' ? 'weekly' : 'monthly';
        item.priority = path === '/' ? 1 : ['/pricing/', '/features/'].includes(path) ? 0.9 : path.startsWith('/features/') ? 0.8 : 0.6;
        return item;
      },
    }),
  ],
});
