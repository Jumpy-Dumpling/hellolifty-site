import { url } from './url';

export const SITE_NAME = 'Lifty';
export const TAGLINE = 'Strength training that gets smarter with you';
export const SITE_DESCRIPTION =
  'Lifty builds your plan, logs every set in seconds, and coaches you as you get stronger. Friends, challenges and a video studio included. Coming soon to iOS and Android.';

/** Absolute URL for a site path, honouring the configured site and base. */
export function absolute(path: string, site: URL | undefined): string {
  return new URL(url(path), site ?? 'http://localhost:4321').href;
}
