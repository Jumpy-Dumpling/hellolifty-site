import { url } from './url';
import { PRICES, TRIAL_DAYS } from './config';

export const SITE_NAME = 'Lifty';
export const SITE_URL = 'https://hellolifty.com';
export const TAGLINE = 'Strength training that gets smarter with you';
export const SITE_TITLE = 'Lifty: Strength Training App with AI Plans, Coach and Friends';
export const SITE_DESCRIPTION =
  'Lifty is a strength training app that builds your plan, logs every set in seconds and coaches you as you get stronger. Coming soon to iOS and Android.';
export const DEFAULT_OG = 'og/home.jpg';

/** Absolute URL for a site path, honouring the configured site and base. */
export function absolute(path: string, site: URL | undefined): string {
  return new URL(url(path), site ?? SITE_URL).href;
}

/** FAQ answers carry a little HTML (links); search and answer engines want plain text. */
export const plain = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

const abs = (path: string, site: URL | undefined) => absolute(path, site);

/** Who publishes the site, and the site itself. These go on every page and are referenced by id from the page-specific data. */
export function baseGraph(site: URL | undefined) {
  return [
    {
      '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE_NAME, url: `${SITE_URL}/`,
      logo: { '@type': 'ImageObject', url: abs('icon-512.png', site), width: 512, height: 512 },
      parentOrganization: { '@type': 'Organization', name: 'Jumpy Dumpling', url: 'https://www.jumpydumpling.com' },
    },
    { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: SITE_NAME, description: SITE_DESCRIPTION, inLanguage: 'en-US', publisher: { '@id': `${SITE_URL}/#organization` } },
  ];
}

/** The app itself. Pre-launch, so the offers are pre-orders; the three prices are the real ones. */
export function appGraph(site: URL | undefined) {
  const offer = (name: string, price: number, extra: Record<string, unknown> = {}) => ({
    '@type': 'Offer', name, price: price.toFixed(2), priceCurrency: 'USD', availability: 'https://schema.org/PreOrder', url: abs('pricing/', site), ...extra,
  });
  return {
    '@type': 'SoftwareApplication', '@id': `${SITE_URL}/#app`, name: SITE_NAME, url: `${SITE_URL}/`,
    description: SITE_DESCRIPTION, applicationCategory: 'HealthApplication', applicationSubCategory: 'Strength training and workout tracker',
    operatingSystem: 'iOS, Android', image: abs(DEFAULT_OG, site), publisher: { '@id': `${SITE_URL}/#organization` },
    featureList: ['Fast set logging with a rest timer and plate calculator', 'AI-built workout plans and proven programs', 'Adaptive coach with written training reviews',
      'Progress analytics, body measurements and progress photos', 'Friends, a workout feed and a weekly leaderboard', 'Challenges', 'Lifty Studio for gym videos', 'Apple Watch app, widgets and Live Activity'],
    offers: [
      offer(`Monthly (${TRIAL_DAYS}-day free trial)`, PRICES.monthly, { priceSpecification: { '@type': 'UnitPriceSpecification', price: PRICES.monthly.toFixed(2), priceCurrency: 'USD', billingDuration: 1, unitCode: 'MON' } }),
      offer(`Yearly (${TRIAL_DAYS}-day free trial)`, PRICES.yearly, { priceSpecification: { '@type': 'UnitPriceSpecification', price: PRICES.yearly.toFixed(2), priceCurrency: 'USD', billingDuration: 1, unitCode: 'ANN' } }),
      offer('Lifetime (limited time)', PRICES.lifetime),
    ],
  };
}

export const faqGraph = (items: [string, string][]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: plain(a) } })),
});

/** The trail from the home page, for example [['Features', 'features/'], ['Set logging', 'features/set-logging/']]. */
export const crumbGraph = (trail: [string, string][], site: URL | undefined) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [['Lifty', ''], ...trail].map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path, site) })),
});

export const pageGraph = (type: string, name: string, description: string, path: string, site: URL | undefined, extra: Record<string, unknown> = {}) => ({
  '@type': type, '@id': `${abs(path, site)}#webpage`, url: abs(path, site), name, description, inLanguage: 'en-US',
  isPartOf: { '@id': `${SITE_URL}/#website` }, publisher: { '@id': `${SITE_URL}/#organization` }, ...extra,
});
