/** The Google Analytics property for hellolifty.com. */
export const GA_ID = 'G-0LCZTR164E';
/** Where a visitor's choice is remembered in their browser: 'granted' or 'denied'. */
export const CONSENT_KEY = 'lifty-consent';

/**
 * Time zones used by the EU, the EEA, the UK and Switzerland (including the EU's overseas regions). A visitor on one of these is asked
 * before analytics run, as GDPR and the ePrivacy rules require. Everywhere else, analytics run automatically (unless the browser sends
 * a Global Privacy Control signal), and the footer's Cookie settings let anyone opt out.
 */
const EUROPE_OUTSIDE = new Set(['Europe/Moscow', 'Europe/Kaliningrad', 'Europe/Samara', 'Europe/Volgograd', 'Europe/Kirov', 'Europe/Astrakhan', 'Europe/Saratov', 'Europe/Ulyanovsk', 'Europe/Minsk', 'Europe/Kyiv', 'Europe/Kiev', 'Europe/Uzhgorod', 'Europe/Zaporozhye', 'Europe/Simferopol', 'Europe/Istanbul', 'Europe/Chisinau', 'Europe/Tiraspol']);
const ELSEWHERE_IN_EUROPE_ZONES = new Set([
  'Atlantic/Canary', 'Atlantic/Madeira', 'Atlantic/Azores', 'Atlantic/Reykjavik', 'Atlantic/Faroe', 'Arctic/Longyearbyen',
  'Africa/Ceuta', 'Indian/Reunion', 'Indian/Mayotte', 'America/Martinique', 'America/Guadeloupe', 'America/Cayenne', 'America/Marigot', 'America/St_Barthelemy',
]);

export function inConsentRegion(timeZone: string | undefined | null): boolean {
  // If the time zone cannot be read, ask: the safe side.
  if (!timeZone) return true;
  if (timeZone.startsWith('Europe/')) return !EUROPE_OUTSIDE.has(timeZone);
  return ELSEWHERE_IN_EUROPE_ZONES.has(timeZone);
}

export type Consent = 'granted' | 'denied';

/**
 * What to do on arrival. `saved` is the visitor's earlier choice. With none, analytics are on by default except in the consent regions
 * (where the banner asks first) and for browsers sending Global Privacy Control.
 */
export function startingConsent(o: { saved: string | null; timeZone: string | undefined | null; gpc: boolean }): { consent: Consent | null; ask: boolean } {
  if (o.saved === 'granted' || o.saved === 'denied') return { consent: o.saved, ask: false };
  if (o.gpc) return { consent: 'denied', ask: false };
  if (inConsentRegion(o.timeZone)) return { consent: null, ask: true };
  return { consent: 'granted', ask: false };
}
