// Audits the built site (run `npm run build` first): every page's title, description, canonical, social tags and graphic, structured data,
// headings, image alt text, and the files search and AI crawlers look for.   Usage: npm run seo
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve('dist');
const SITE = 'https://hellolifty.com';
const pages = [];
(function walk(dir) { for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) walk(p); else if (f === 'index.html' || f === '404.html') pages.push(p); } })(dist);

const attr = (html, re) => (html.match(re) || [])[1];
const meta = (html, key) => attr(html, new RegExp(`<meta[^>]*(?:name|property)="${key}"[^>]*content="([^"]*)"`)) ?? attr(html, new RegExp(`<meta[^>]*content="([^"]*)"[^>]*(?:name|property)="${key}"`));
const decode = (s = '') => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
let failures = 0, warnings = 0;
const fail = (page, msg) => { failures++; console.log(`  FAIL ${page}: ${msg}`); };
const warn = (page, msg) => { warnings++; console.log(`  warn ${page}: ${msg}`); };
const seenTitles = new Map(), seenDescriptions = new Map();

for (const file of pages.sort()) {
  const html = readFileSync(file, 'utf8');
  const rel = file.slice(dist.length).replace(/index\.html$/, '') || '/';
  const is404 = rel === '/404.html';
  const title = decode(attr(html, /<title>([^<]*)<\/title>/));
  const desc = decode(meta(html, 'description'));
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  const noindex = /name="robots" content="noindex/.test(html);

  if (!title) fail(rel, 'no <title>'); else { if (title.length > 65) warn(rel, `title is ${title.length} characters (aim for 60 or fewer)`); if (title.length < 25 && !is404) warn(rel, `title is short (${title.length})`); }
  if (!desc) fail(rel, 'no description'); else { if (desc.length > 165) warn(rel, `description is ${desc.length} characters (aim for 160 or fewer)`); if (desc.length < 70 && !is404) warn(rel, `description is short (${desc.length})`); }
  seenTitles.set(title, [...(seenTitles.get(title) || []), rel]); seenDescriptions.set(desc, [...(seenDescriptions.get(desc) || []), rel]);

  if (!canonical?.startsWith(SITE)) fail(rel, `canonical is ${canonical}`);
  else if (!is404 && canonical !== SITE + rel) fail(rel, `canonical ${canonical} does not match the page address`);
  if (/localhost|127\.0\.0\.1/.test(html)) fail(rel, 'mentions localhost');
  if (/http:\/\/(www\.)?hellolifty\.com/.test(html)) fail(rel, 'links to the site over http:// instead of https://');

  if (!is404) {
    for (const k of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt', 'og:type', 'og:site_name', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']) if (!meta(html, k)) fail(rel, `missing ${k}`);
    if (decode(meta(html, 'og:title')) !== title) fail(rel, 'og:title differs from <title>');
    if (decode(meta(html, 'og:description')) !== desc) fail(rel, 'og:description differs from description');
    if (meta(html, 'og:url') !== canonical) fail(rel, 'og:url differs from canonical');
    const img = meta(html, 'og:image');
    if (!img?.startsWith(SITE + '/')) fail(rel, `og:image is not an absolute URL on the site: ${img}`);
    else {
      const local = join(dist, img.slice(SITE.length));
      if (!existsSync(local)) fail(rel, `og:image file is missing: ${img}`);
      else {
        const buf = readFileSync(local);
        // JPEG size lives in the SOF marker.
        let w = 0, h = 0; for (let i = 2; i < buf.length - 9; i++) if (buf[i] === 0xff && buf[i + 1] >= 0xc0 && buf[i + 1] <= 0xc3) { h = buf.readUInt16BE(i + 5); w = buf.readUInt16BE(i + 7); break; }
        if (w !== 1200 || h !== 630) fail(rel, `og:image is ${w}x${h}, expected 1200x630`);
        if (buf.length > 300 * 1024) warn(rel, `og:image is ${Math.round(buf.length / 1024)} KB`);
      }
    }
    if (meta(html, 'twitter:image') !== img) fail(rel, 'twitter:image differs from og:image');
    if (noindex) fail(rel, 'is marked noindex');
  } else if (!noindex) fail(rel, '404 page should be noindex');

  // structured data
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (!blocks.length) fail(rel, 'no structured data');
  const types = [];
  for (const b of blocks) { try { const g = JSON.parse(b); for (const n of g['@graph'] ?? [g]) types.push(n['@type']); } catch (e) { fail(rel, 'structured data is not valid JSON'); } }
  if (!is404) {
    for (const t of ['Organization', 'WebSite']) if (!types.includes(t)) fail(rel, `structured data lacks ${t}`);
    if (rel !== '/' && !types.includes('BreadcrumbList')) fail(rel, 'structured data lacks BreadcrumbList');
    const faqs = (html.match(/<details class="reveal/g) || []).length; // the FAQ cards (the mobile menu has its own accordion)
    if (faqs && !types.includes('FAQPage')) fail(rel, `has ${faqs} FAQ items but no FAQPage data`);
    if (faqs) { const g = JSON.parse(blocks[0]); const q = g['@graph'].find((n) => n['@type'] === 'FAQPage')?.mainEntity?.length; if (q !== faqs) fail(rel, `FAQPage lists ${q} questions but the page shows ${faqs}`); }
  }

  // headings and images
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(rel, `has ${h1} <h1> (expected 1)`);
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  for (const t of imgs) { if (!/\balt(=|\s|>)/.test(t)) fail(rel, `image without alt: ${t.slice(0, 80)}`); if (!/\bwidth=/.test(t) || !/\bheight=/.test(t)) warn(rel, `image without width/height: ${t.slice(0, 80)}`); }
  const emptyLinks = [...html.matchAll(/<a\b[^>]*href="[^"]*"[^>]*>\s*<\/a>/g)].length;
  if (emptyLinks) fail(rel, `${emptyLinks} link(s) with no text`);
  if (!/<html lang="en"/.test(html)) fail(rel, 'no lang on <html>');
  if (!/name="viewport"/.test(html)) fail(rel, 'no viewport');
}

for (const [map, label] of [[seenTitles, 'title'], [seenDescriptions, 'description']]) for (const [v, where] of map) if (where.length > 1) warn(where.join(', '), `share the same ${label}: "${v.slice(0, 50)}"`);

console.log('\nFiles crawlers look for:');
for (const f of ['sitemap-index.xml', 'sitemap-0.xml', 'robots.txt', 'llms.txt', 'llms-full.txt']) if (existsSync(join(dist, f)) && /http:\/\/(www\.)?hellolifty\.com/.test(readFileSync(join(dist, f), 'utf8'))) fail(f, 'contains an http:// address for the site');
const must = ['robots.txt', 'sitemap-index.xml', 'sitemap-0.xml', 'llms.txt', 'llms-full.txt', 'site.webmanifest', 'favicon.ico', 'favicon.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'CNAME'];
for (const f of must) { const ok = existsSync(join(dist, f)); console.log(`  ${ok ? 'ok  ' : 'FAIL'} /${f}`); if (!ok) failures++; }
if (existsSync(join(dist, 'robots.txt'))) { const r = readFileSync(join(dist, 'robots.txt'), 'utf8'); if (!/Sitemap: https:\/\/hellolifty\.com\//.test(r)) fail('robots.txt', 'no sitemap line'); if (/Disallow: \//.test(r)) fail('robots.txt', 'blocks crawlers'); }
if (existsSync(join(dist, 'sitemap-0.xml'))) {
  const sm = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
  const urls = [...sm.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
  console.log(`  sitemap lists ${urls.length} pages`);
  if (urls.some((u) => !u.startsWith('https://'))) fail('sitemap', `has non-https addresses: ${urls.filter((u) => !u.startsWith('https://')).join(', ')}`);
  for (const f of pages) { const rel = f.slice(dist.length).replace(/index\.html$/, '') || '/'; if (rel === '/404.html') continue; if (!urls.includes(SITE + rel)) fail('sitemap', `missing ${rel}`); }
  if (urls.some((u) => u.includes('404'))) fail('sitemap', 'lists the 404 page');
  if (!/<lastmod>/.test(sm)) warn('sitemap', 'no lastmod dates');
}
console.log(`\n${pages.length} pages checked: ${failures} failure(s), ${warnings} warning(s)`);
process.exit(failures ? 1 : 0);
