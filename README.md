# hellolifty.com

The Lifty marketing site. It is an [Astro](https://astro.build) static site hosted on GitHub Pages, set up the same way as the Jumpy Dumpling site
(Astro 7, `@astrojs/sitemap`, and the same GitHub Actions deploy workflow). The look matches the app: a light, airy canvas with Lifty's blues.

## Pages

| Path | What it is |
|------|------------|
| `/` | Home: hero, scrolling story, feature tiles, pricing summary, waitlist, FAQ |
| `/features/` | All features, and a deep-dive page for each (set logging, AI plans, adaptive coach, progress and body, friends, challenges, Lifty Studio, Apple Watch) |
| `/pricing/` | Plans, what is included, how the trial works, billing FAQ |
| `/about/` | The story and values |
| `/contact/` | A contact form (messages land in your Supabase database) |
| `/privacy/`, `/terms/` | The privacy policy and terms of use for the app and site (`src/pages/privacy.astro`, `terms.astro`, on the `LegalPage` component) |

**Analytics and cookie consent.** Google Analytics (`GA_ID` in `src/lib/consent.ts`) loads only after consent: automatically outside the EU, EEA, UK and Switzerland, after the visitor taps Accept inside them (the region is guessed from the browser's time zone, and an unreadable one counts as inside), and never when the browser sends Global Privacy Control. The footer's Cookie settings reopen the choice for everyone. Logic: `src/lib/consent.ts` (rules) and `src/scripts/consent.ts` (banner and loading). When you add another tool that sets cookies, load it from the same place.

The **Features mega menu** in the nav is built from the same list as the deep-dive pages, so adding a feature to `src/data/features.ts` adds it to the menu,
the features index, the footer and its own page.

## Run it

Needs Node 22.23.4 or newer (`nvm use 22.23.4`).

    npm install
    npm run dev          # http://localhost:4321
    npm run build        # writes dist/
    npm run preview

## Put it online (GitHub Pages)

1. Create a repository for it (for example `Jumpy-Dumpling/hellolifty-site`), then from this folder:

       git init -b main && git add . && git commit -m "Lifty site"
       git remote add origin git@github.com:Jumpy-Dumpling/hellolifty-site.git && git push -u origin main

2. On GitHub, **Settings > Pages > Build and deployment**: Source **GitHub Actions**. The workflow in `.github/workflows/deploy.yml` builds and publishes on every push to `main`.
3. Under **Custom domain** enter `hellolifty.com` (`public/CNAME` already says so), and turn on **Enforce HTTPS** once it is offered.
4. At the registrar (GoDaddy), add these DNS records for `hellolifty.com`, and delete any parking-page records:

   | Type | Name | Value |
   |------|------|-------|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | `<your-github-org>.github.io` |

   The Resend email records you added earlier are separate and stay as they are.

## The waitlist and the contact form

Both call a function on the Lifty Supabase project, using the public key in `src/lib/config.ts` (meant to be public; the tables cannot be read or written from the web):

- `join_waitlist` (`supabase/migrations/20261126000000_waitlist.sql` in the app repo)
- `submit_contact` (`supabase/migrations/20261127000000_contact_messages.sql`)

Run `supabase db push` there first. Each migration's header has the queries to read what came in (the whole waitlist, iPhone or Android only, new contact messages).
Contact messages do not notify you; check the table, or ask for an email notification to be wired up once `zac@hellolifty.com` can receive mail.

## SEO, answer engines and sharing

Every page sets its own title, description, canonical address, share graphic and structured data (`src/layouts/Base.astro` builds the tags; each page passes its own copy).

- **Titles and descriptions** for the feature pages are in `src/data/features.ts` (`seoTitle`, `seoDescription`); other pages set theirs at the top of the page file.
  Aim for titles of 60 characters or fewer and descriptions of 120 to 160.
- **Share graphics** (1200x630, one per page) are in `public/og/`. `python3 design/og.py` redraws them all, or `python3 design/og.py coach` one. Edit the headlines in `CARDS` in that file.
- **Structured data** (schema.org JSON-LD): Organization and WebSite on every page, plus the page, breadcrumbs, the app with its three prices, and FAQ data built from
  the same text as the visible FAQ (`src/data/faqs.ts` and each feature's `faq`), so the two never disagree.
- **For AI assistants and crawlers:** `/robots.txt` welcomes search and AI crawlers by name, `/llms.txt` is a plain-text summary of the site and `/llms-full.txt` has every feature page's copy.
- **Check it:** `npm run build && npm run seo` audits every built page (titles, descriptions, canonicals, social tags, share-graphic size, structured data,
  headings, image alt text, sitemap and the files crawlers look for) and exits with an error if anything is wrong. Run it before each deploy.
- The canonical address is `https://hellolifty.com`; builds never fall back to `localhost`.
- After it is live, submit `https://hellolifty.com/sitemap-index.xml` in Google Search Console and Bing Webmaster Tools, and check a link in the
  [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and the LinkedIn Post Inspector, which also refresh their caches.

## Where things live

- `src/pages/` has the routes; `src/components/` the sections; `src/data/features.ts` every feature's copy; `src/lib/config.ts` the prices, trial lengths and links.
  Keep the prices in step with `src/lib/pricing.ts` in the app.
- `src/styles/`: `tokens.css` (palette), `base.css` (page, nav, mega menu, footer), `sections.css` (home), `pages.css` (feature, pricing, about and contact pages).
- `src/scripts/`: `fx.ts` (scroll reveals, sticky phone, pointer effects), `nav.ts` (mega menu and phone drawer), `forms.ts` (waitlist, contact, confetti).
  Everything degrades to a plain page without JavaScript, and honors "reduce motion".
- `public/screens/*.webp` are the app screenshots, rendered by `design/screens.py` from recreations of the real screens (12 screens). To use real simulator
  captures instead, drop 1170x2532 images in with the same names. `python3 design/screens.py today` redraws one.
- `public/og.png` is the social preview card, rendered from `design/og.html`.
- **Icons:** add a name to `design/build-fonts.py`, run it (needs `fonttools` and `brotli`), and use `<i class="i i-NAME"></i>`.
- **When the app launches:** swap the "Coming soon" badges in `src/components/Waitlist.astro` for real App Store and Google Play links, and update the hero pill.
