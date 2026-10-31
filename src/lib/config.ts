/** What people pay, in dollars. Keep in step with src/lib/pricing.ts in the app. */
export const PRICES = { monthly: 7.99, yearly: 59.99, lifetime: 199.99 } as const;
const money = (n: number) => `$${n.toFixed(2)}`;
export const PRICE_MONTHLY = money(PRICES.monthly);
export const PRICE_YEARLY = money(PRICES.yearly);
export const PRICE_LIFETIME = money(PRICES.lifetime);
export const YEARLY_PER_MONTH = money(PRICES.yearly / 12);
export const YEARLY_SAVINGS_PERCENT = Math.round((1 - PRICES.yearly / (PRICES.monthly * 12)) * 100);

export const TRIAL_DAYS = 7;
export const REFERRAL_TRIAL_DAYS = 14;

/**
 * The waitlist talks to the Lifty Supabase project. The publishable key is meant to be public (it ships inside the app too);
 * the join_waitlist function is the only thing it can reach, and the table cannot be read from the web.
 */
export const SUPABASE_URL = 'https://wgnoggamuniednonmabq.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_NfDqiX95zXe6PI6RJhR8TA_AdqcWEDZ';

export const LINKS = {
  terms: 'https://www.jumpydumpling.com/lifty/tos',
  privacy: 'https://www.jumpydumpling.com/lifty/privacy',
  studio: 'https://www.jumpydumpling.com',
};
