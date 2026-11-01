import type { APIRoute } from 'astro';
import { features } from '../data/features';
import { homeFaq, pricingFaq } from '../data/faqs';
import { PRICE_LIFETIME, PRICE_MONTHLY, PRICE_YEARLY, REFERRAL_TRIAL_DAYS, TRIAL_DAYS } from '../lib/config';
import { absolute, plain, SITE_DESCRIPTION, SITE_NAME, TAGLINE } from '../lib/seo';

// llms.txt: a plain-markdown summary of the site for AI assistants and answer engines. llms-full.txt has the long version.
export const GET: APIRoute = ({ site }) => {
  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> ${TAGLINE}. ${SITE_DESCRIPTION}`,
    '',
    `${SITE_NAME} is a strength training app for iPhone and Android, made by Zac at Jumpy Dumpling. It is not released yet: people can join the waitlist at ${absolute('', site)} to be emailed at launch.`,
    '',
    `Pricing: Lifty is free to start. Logging, workout history, importing from Strong or Hevy, friends and challenges, and the Apple Watch app are free for good. Premium (the adaptive coach, AI plans, deeper analytics and the full Studio) is ${PRICE_MONTHLY} a month, ${PRICE_YEARLY} a year, or ${PRICE_LIFETIME} once for Lifetime (a limited-time offer). Every new account gets ${TRIAL_DAYS} days of Premium with no card (${REFERRAL_TRIAL_DAYS} days if a friend invited you).`,
    '',
    '## Features',
    '',
    ...features.map((f) => `- [${f.name}](${absolute(`features/${f.slug}/`, site)}): ${f.seoDescription}`),
    '',
    '## Pages',
    '',
    `- [Home](${absolute('', site)}): what Lifty is, how it works, and the waitlist`,
    `- [All features](${absolute('features/', site)}): every feature at a glance`,
    `- [Pricing](${absolute('pricing/', site)}): what is free, what Premium adds, how the free Premium period works`,
    `- [About](${absolute('about/', site)}): who makes Lifty and what it values`,
    `- [Contact](${absolute('contact/', site)}): questions, feedback and press`,
    '',
    '## Common questions',
    '',
    ...[...homeFaq, ...pricingFaq.filter(([q]) => !homeFaq.some(([h]) => h === q))].map(([q, a]) => `- ${q} ${plain(a)}`),
    '',
    `Full text of every feature page: ${absolute('llms-full.txt', site)}`,
    '',
  ].join('\n');
  return new Response(lines, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
