import type { APIRoute } from 'astro';
import { features } from '../data/features';
import { absolute, plain, SITE_DESCRIPTION, SITE_NAME, TAGLINE } from '../lib/seo';

// The long version of llms.txt: the copy of every feature page, in plain markdown.
export const GET: APIRoute = ({ site }) => {
  const parts = [
    `# ${SITE_NAME}: ${TAGLINE}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    ...features.flatMap((f) => [
      `## ${f.name}`,
      `Page: ${absolute(`features/${f.slug}/`, site)}`,
      '',
      `${f.title} ${f.lede}`,
      '',
      '### What you get',
      ...f.highlights.map((h) => `- ${h.title}: ${h.text}`),
      '',
      ...f.sections.flatMap((s) => [`### ${s.title}`, s.body, ...s.ticks.map((t) => `- ${t}`), '']),
      '### Questions',
      ...f.faq.map(([q, a]) => `- ${q} ${plain(a)}`),
      '',
    ]),
  ].join('\n');
  return new Response(parts, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
