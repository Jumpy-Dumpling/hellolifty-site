import { LINKS, TRIAL_DAYS, REFERRAL_TRIAL_DAYS, PRICE_MONTHLY, PRICE_YEARLY, PRICE_LIFETIME } from '../lib/config';

/** The questions shown on the page and the ones in the page's FAQ structured data come from here, so they can never disagree. */
export const homeFaq: [string, string][] = [
  ['When does Lifty launch?', "Soon. Join the waitlist and you'll get one email the day it's available on the App Store and Google Play."],
  ['Is there a free version?', `Lifty has no free tier. Every plan starts with a ${TRIAL_DAYS}-day free trial, so you can try everything before you pay. If a friend invited you, the trial is ${REFERRAL_TRIAL_DAYS} days.`],
  ['Which phones does it work on?', 'Lifty is coming to both iPhone and Android. The Apple Watch app is part of the iPhone version.'],
  ['Can I bring my workout history?', 'Yes. Import your history from Strong or Hevy, and your records and trends come with you.'],
  ['Do I need a connection to log a workout?', "No. Workouts are saved on your phone first and back up to your account when you're online. Friends and the AI coach need a connection."],
  ['Who can see my workouts?', `Only people you've accepted as friends, and only the workouts you choose to share. Read the <a href="${LINKS.privacy}">privacy policy</a> for the details.`],
  ['How do I cancel?', 'Subscriptions are managed in your Apple ID or Google Play settings, and you can cancel any time. Lifetime is a one-time purchase with nothing to cancel.'],
];

export const pricingFaq: [string, string][] = [
  ['Is there a free plan?', `No. Every plan includes everything, and each starts with a ${TRIAL_DAYS}-day free trial so you can try it all first.`],
  ['How does the free trial work?', `You start a monthly or yearly plan and get ${TRIAL_DAYS} days free. If you cancel before the trial ends, you are not charged. If a friend invited you, the trial is ${REFERRAL_TRIAL_DAYS} days.`],
  ['What is the difference between the plans?', `Nothing about the features: every plan includes all of Lifty. Monthly is ${PRICE_MONTHLY} a month, Yearly is ${PRICE_YEARLY} a year, and Lifetime is ${PRICE_LIFETIME} once.`],
  ['What does Lifetime include?', 'Lifty for good, with nothing more to pay, plus a Lifty starter pack: a tank or T-shirt, gym socks and a drawstring bag. It is a limited-time offer and will not always be available.'],
  ['How do I cancel?', 'Subscriptions are managed in your Apple ID or Google Play settings, and you can cancel any time. Lifetime is a one-time purchase with nothing to cancel.'],
  ['Where do I pay?', 'Purchases go through the App Store or Google Play, so payment and renewals are handled by Apple or Google, not by Lifty.'],
];
