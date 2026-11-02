import { LINKS, TRIAL_DAYS, REFERRAL_TRIAL_DAYS, PRICE_MONTHLY, PRICE_YEARLY, PRICE_LIFETIME } from '../lib/config';

/** The questions shown on the page and the ones in the page's FAQ structured data come from here, so they can never disagree. */
export const homeFaq: [string, string][] = [
  ['When does Lifty launch?', "Soon. Join the waitlist and you'll get one email the day it's available on the App Store and Google Play."],
  ['Is there a free version?', `Yes. Logging, your workout history, importing from Strong or Hevy, friends, challenges and the Apple Watch app are free for good. Premium adds the adaptive coach, training blocks, AI plans, plateau alerts and the full Studio. Every new account starts with ${TRIAL_DAYS} days of Premium and no card, or ${REFERRAL_TRIAL_DAYS} days if a friend invited you, then simply keeps the free version unless you upgrade.`],
  ['Do I need a password?', 'No. You sign in with Apple on iPhone or with Google on Android, so there is no password to make or lose. Apple lets you hide your email address from us.'],
  ['Will Lifty send me notifications?', 'Only the ones you choose. Reminders for your workouts, and, if you want them, a notification when a friend posts or when someone comments on or reacts to your post. Each has its own switch in Settings, and announcements from the Lifty team never send one.'],
  ['Can I train with just my Apple Watch?', 'Yes. Open Lifty on your iPhone once near the watch so it copies your routines, and after that you can start a routine or repeat your last workout from the wrist with the phone at home. The workout is saved on the watch and sent to your iPhone when you are back in range.'],
  ['Which phones does it work on?', 'Lifty is coming to both iPhone and Android. The Apple Watch app is part of the iPhone version.'],
  ['Can I bring my workout history?', 'Yes. Import your history from Strong or Hevy, and your records and trends come with you.'],
  ['Do I need a connection to log a workout?', "No. Workouts are saved on your phone first and back up to your account when you're online. Friends and the AI coach need a connection."],
  ['Who can see my workouts?', `Only people you've accepted as friends, and only the workouts you choose to share. Read the <a href="${LINKS.privacy}">privacy policy</a> for the details.`],
  ['How do I cancel?', 'Subscriptions are managed in your Apple ID or Google Play settings, and you can cancel any time. Lifetime is a one-time purchase with nothing to cancel.'],
];

export const pricingFaq: [string, string][] = [
  ['Is there a free plan?', `Yes. Lifty is free to start and the basics stay free: logging every set, your history, four routines, importing, friends and challenges, and the Apple Watch app. Premium is ${PRICE_MONTHLY} a month, ${PRICE_YEARLY} a year, or ${PRICE_LIFETIME} once.`],
  ['How does the free Premium period work?', `Make an account and you get ${TRIAL_DAYS} days of Premium, with no card and nothing to cancel (${REFERRAL_TRIAL_DAYS} days if a friend invited you). When it ends you are not charged: you keep the free version, with all your workouts and history, and can upgrade any time.`],
  ['What is the difference between the plans?', `Monthly, Yearly and Lifetime all include the same Premium features. Monthly is ${PRICE_MONTHLY} a month, Yearly is ${PRICE_YEARLY} a year, and Lifetime is ${PRICE_LIFETIME} once. What Premium adds over the free version is the adaptive coach, AI plans, suggested weights, deeper analytics, body measurements and photos, unlimited routines, and the full Studio.`],
  ['What does Lifetime include?', 'Lifty for good, with nothing more to pay, plus a Lifty starter pack: a tank or T-shirt, gym socks and a drawstring bag. It unlocks 30 days after you buy (a short wait that helps protect accounts from misuse and fraud), then you choose a tank or T-shirt and send your mailing address from Settings, and the app tracks it until it ships. It is a limited-time offer and will not always be available.'],
  ['How do I cancel?', 'Subscriptions are managed in your Apple ID or Google Play settings, and you can cancel any time. Lifetime is a one-time purchase with nothing to cancel.'],
  ['Where do I pay?', 'Purchases go through the App Store or Google Play, so payment and renewals are handled by Apple or Google, not by Lifty.'],
];
