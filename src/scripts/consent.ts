// Cookie consent and Google Analytics. Analytics load only once consent is "granted": automatically outside the EU, EEA, UK and
// Switzerland (see lib/consent.ts), and after the visitor taps Accept inside them. Cookie settings in the footer reopen the choice for everyone.
import { CONSENT_KEY, GA_ID, startingConsent, type Consent } from '../lib/consent';

const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void; [k: string]: unknown };
const banner = document.getElementById('consent');
let loaded = false;

const read = () => { try { return localStorage.getItem(CONSENT_KEY); } catch { return null; } };
const write = (c: Consent) => { try { localStorage.setItem(CONSENT_KEY, c); } catch { /* private mode: the choice lasts until the page closes */ } };

function loadAnalytics() {
  if (loaded) return;
  loaded = true;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () { w.dataLayer.push(arguments); };
  w.gtag('js', new Date());
  w.gtag('config', GA_ID, { anonymize_ip: true });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

/** Switches analytics off and removes the cookies Google set, so a changed mind takes effect straight away. */
function stopAnalytics() {
  w[`ga-disable-${GA_ID}`] = true;
  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0].trim();
    if (name === '_ga' || name.startsWith('_ga_') || name === '_gid' || name === '_gat') {
      for (const domain of [location.hostname, `.${location.hostname}`, `.${location.hostname.split('.').slice(-2).join('.')}`]) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
      }
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  }
}

const show = (open: boolean) => { if (banner) { banner.hidden = !open; if (open) banner.querySelector<HTMLButtonElement>('[data-consent="granted"]')?.focus({ preventScroll: true }); } };

function choose(c: Consent) {
  write(c);
  if (c === 'granted') { w[`ga-disable-${GA_ID}`] = false; loadAnalytics(); } else stopAnalytics();
  show(false);
}

const start = startingConsent({
  saved: read(),
  timeZone: (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return null; } })(),
  gpc: (navigator as unknown as { globalPrivacyControl?: boolean }).globalPrivacyControl === true,
});
if (start.consent === 'granted') loadAnalytics();
if (start.ask) show(true);

banner?.querySelectorAll<HTMLButtonElement>('[data-consent]').forEach((b) => b.addEventListener('click', () => choose(b.dataset.consent as Consent)));
document.querySelectorAll('[data-cookie-settings]').forEach((b) => b.addEventListener('click', () => show(true)));
