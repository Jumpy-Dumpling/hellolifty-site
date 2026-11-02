/** Everything about each feature, in one place: it feeds the mega menu, the features index and every deep-dive page. */
/** `tier` says whether a highlight is part of the free app or of Premium; `tierNote` says what free accounts still get ("1 free a month"). */
export type Highlight = { icon: string; title: string; text: string; tier?: 'free' | 'premium'; tierNote?: string };
export type Section = { kicker: string; title: string; body: string; ticks: string[]; screen?: string; visual?: 'watch' | 'lock' };
export type Feature = {
  slug: string;
  name: string;
  icon: string;
  /** Icon-tile gradient, the pastel behind the mega-menu icon, and the color of the icon on it. */
  c1: string; c2: string; pastel: string; ink: string;
  menu: string;
  /** What search results and shared links show: a keyword-rich title and a description of 120-165 characters. */
  seoTitle: string;
  seoDescription: string;
  title: string;
  lede: string;
  main: string;
  side?: string;
  highlights: Highlight[];
  sections: Section[];
  faq: [string, string][];
  related: string[];
};

export const features: Feature[] = [
  {
    slug: 'set-logging', name: 'Set logging', icon: 'timer', c1: '#37A2FF', c2: '#0A62F0', pastel: '#E3F0FF', ink: '#0A7AFF',
    menu: 'Fast logging with a rest timer and PR celebrations',
    seoTitle: 'Workout Logging App with Rest Timer & PR Tracking | Lifty',
    seoDescription: 'Log every set in seconds. Lifty shows last session beside each set, suggests when to add weight, and includes a rest timer, plate calculator and PR tracking.',
    title: 'Log a set in seconds, not minutes.',
    lede: "Everything you need mid-workout and nothing you don't. Last session's numbers sit beside every set, and Lifty tells you what to try next.",
    main: 'workout', side: 'summary',
    highlights: [
      { icon: 'time', title: 'Last time, right there', text: "The weight and reps from your previous session sit beside every set, so you always know what to beat.", tier: 'free' },
      { icon: 'trending-up', title: 'Weights filled in for you', text: 'Lifty fills in today’s weight and reps from how your last sessions went, and says it plainly: “Try 65 lb total, up 5 lb. On a 45 lb bar that is 10 lb on each side.” Barbell lifts say total, dumbbells say each.', tier: 'premium' },
      { icon: 'timer', title: 'A rest timer per exercise', text: 'Set a rest for each lift and Lifty remembers it. The timer stays pinned while you scroll.', tier: 'free' },
      { icon: 'calculator', title: 'Plates and warm-ups', text: 'See which plates to load for a target weight, and ramp up with warm-up sets.', tier: 'free' },
      { icon: 'link', title: 'Supersets and set types', text: 'Link exercises into supersets. Mark warm-up, drop and failure sets, and do one side at a time.', tier: 'free' },
      { icon: 'fitness', title: 'More than weights', text: 'Cardio, timed holds and band work have their own fields, so the log fits how you really train.', tier: 'free' },
    ],
    sections: [
      { kicker: 'In the moment', title: 'Built for the gym floor.', body: 'Big targets, one hand, no hunting. Check a set off in one tap, adjust weight and reps right in the row, and your rest timer starts on its own.',
        ticks: ['Check a set off with a single tap', 'Edit weight and reps in the row itself', 'Add a note to any exercise', 'Left and right sets for one-sided lifts'], screen: 'workout' },
      { kicker: 'Records', title: 'Every personal record, celebrated.', body: 'Lifty spots a record the moment you log it, and the workout summary lays out everything you did.',
        ticks: ['Records flagged live, in the set row', 'A summary with time, volume, sets and records', 'Share a record, or post it to your friends', 'An estimated one-rep max for every lift'], screen: 'summary' },
    ],
    faq: [
      ['Can I log without a connection?', "Yes. Workouts are saved on your phone first and back up to your account when you're online."],
      ['Is there something to do between sets?', 'There is an optional puzzle beside the rest timer, if you want one. Pick a game in settings, or leave it off.'],
      ['Can I track how hard a set felt?', 'Yes. RPE tracking is optional, and you can switch it on in settings.'],
      ['Does Lifty tell me how to load the bar?', 'Yes. A barbell suggestion says the total, how much it goes up by, and what goes on each side of the bar. Dumbbells say each, and machines show just the number.'],
    ],
    related: ['plans', 'progress', 'watch'],
  },
  {
    slug: 'plans', name: 'AI plans', icon: 'sparkles', c1: '#5CC8FF', c2: '#12A8D6', pastel: '#DDF4FB', ink: '#0E8FB8',
    menu: 'Programs built for your goal, schedule and gear',
    seoTitle: 'AI Workout Plan Builder and Training Programs | Lifty',
    seoDescription: 'Build a workout plan with AI, start from a proven program, or import your own notes, a photo, or your Strong and Hevy history. Edit everything before you save.',
    title: 'A plan that fits your week.',
    lede: 'Answer a few questions and Lifty writes your program. Or start from a proven template, build your own, or import the plan you already have.',
    main: 'plan', side: 'train',
    highlights: [
      { icon: 'sparkles', title: 'Build with AI', text: 'Tell Lifty your goal, experience, schedule and equipment, and get a full program in moments.', tier: 'premium', tierNote: '1 free a month' },
      { icon: 'layers', title: 'Proven programs', text: 'Start from classics like Full Body, Upper / Lower and Push / Pull / Legs, then make them yours.', tier: 'free', tierNote: '5-day and 6-day programs are Premium' },
      { icon: 'add', title: 'Build it yourself', text: 'Pick your own exercises and set the sets, reps and rest for each one.', tier: 'free', tierNote: 'Up to four routines free' },
      { icon: 'camera', title: 'Import from your notes', text: 'Paste a plan from Notes, or snap a photo of it. Lifty reads it into routines you can edit.', tier: 'premium', tierNote: '1 free a month' },
      { icon: 'cloud-upload', title: 'Bring your history', text: 'Import your past workouts from Strong or Hevy so your records and trends come with you.', tier: 'free' },
      { icon: 'calendar', title: 'A schedule that sticks', text: 'Routines land on the days you choose, and "up next" always shows what is due.', tier: 'free' },
    ],
    sections: [
      { kicker: 'Built for you', title: 'Review it before you commit.', body: 'Your plan arrives as a draft. Check it against your body and your week, change anything, or ask for a different one. Nothing is saved until you approve it.',
        ticks: ['Choose full gym, dumbbells or bodyweight', 'Add notes: injuries, favorite lifts, things you hate', 'Edit exercises, sets and reps before saving', 'Works offline with a built-in plan builder'], screen: 'plan' },
      { kicker: 'Your routines', title: 'Always know what is next.', body: 'Routines show their days, length and exercises at a glance. Start one in a tap, or tweak it whenever your training changes.',
        ticks: ['Routines scheduled on the days you pick', 'Edit exercises, sets, reps and rest any time', 'Form guides for every exercise', 'Add your own custom exercises'], screen: 'train' },
    ],
    faq: [
      ['Do I need AI to use Lifty?', 'No. You can start from a program, build your own routines, or import a plan. The AI builder is one option of four.'],
      ['What can I import?', "Plans from your notes (as text or a photo), and your workout history from Strong or Hevy."],
      ['Can I change my plan later?', 'Anytime. Every routine is editable, and the adaptive coach can suggest changes as you progress.'],
    ],
    related: ['set-logging', 'coach', 'progress'],
  },
  {
    slug: 'coach', name: 'Adaptive coach', icon: 'pulse', c1: '#2FD0A0', c2: '#0E9CC8', pastel: '#DDF7EE', ink: '#0E9C77',
    menu: 'Written notes and suggestions that adapt to you',
    seoTitle: 'Adaptive AI Workout Coach and Training Review | Lifty',
    seoDescription: 'Get a written coach note on your last four weeks. Lifty spots stalled lifts, balances muscle volume and books your deload weeks in a training block. You approve every change.',
    title: 'A coach that reads your training.',
    lede: 'Every few weeks Lifty looks at what you actually did and writes you a note in plain language, with specific next steps. Nothing changes until you say so.',
    main: 'coach', side: 'workout',
    highlights: [
      { icon: 'analytics', title: 'A four-week review', text: 'Sessions per week against your goal, volume against the month before, and what is climbing or stalling.', tier: 'free' },
      { icon: 'sparkles', title: 'A note written for you', text: 'A short headline, a summary and two to four concrete actions, in plain language.', tier: 'premium', tierNote: 'First one free' },
      { icon: 'trending-up', title: 'Stalls spotted', text: 'Lifts that have stopped moving get flagged, with a suggestion for what to change.', tier: 'free' },
      { icon: 'layers', title: 'Volume kept balanced', text: 'See which muscles are under or over their weekly range, and where to add or drop a set.', tier: 'premium' },
      { icon: 'battery-charging', title: 'Deload weeks, called', text: 'When several lifts dip together, Lifty suggests a lighter week before you burn out.', tier: 'premium' },
      { icon: 'checkmark-circle', title: 'You stay in charge', text: 'Suggestions wait for your Apply. You can tweak the numbers first, and change it back any time.', tier: 'premium' },
      { icon: 'analytics', title: 'A recap after every workout', text: 'A quick read on the session you just finished, built from your own numbers: what went well and what to do next time.', tier: 'premium', tierNote: '3 free a month' },
      { icon: 'gift', title: 'Your first note is free', text: 'Log three proper workouts and the coach unlocks. Your first written note costs nothing, so you can see what it is like before you decide.', tier: 'free' },
      { icon: 'calendar', title: 'Training blocks', text: 'Pick a block of 4 to 12 weeks and Lifty books the deload weeks for you: build, build, push, deload. You get a heads-up the evening before each one, and push weeks aim your rep targets at the top of the range.', tier: 'premium' },
      { icon: 'trending-up', title: 'Suggestions spelled out', text: 'Above your sets, one line says whether to add weight, repeat the load or back off, and exactly how: the new total, how much it goes up by, and what goes on each side of the bar.', tier: 'premium' },
    ],
    sections: [
      { kicker: 'The review', title: 'Your last four weeks, read like a coach would.', body: 'The review turns your logs into a clear picture, and the coach note turns that picture into what to do next week.',
        ticks: ['Spots lifts that have stalled and volume that is uneven', 'Calls deload weeks before you burn out', 'Writes specific next steps, with the numbers', 'A generous monthly allowance of notes'], screen: 'coach' },
      { kicker: 'Training blocks', title: 'The easy week, booked in advance.', body: 'Instead of waiting until you are worn out, plan the whole block. Lifty lays out build weeks, a push week and a deload, tells you where you are on the Today screen and starts your workouts lighter in the deload.',
        ticks: ['Blocks of 4, 6, 8 or 12 weeks, starting today', 'Deload weeks that set your workouts up lighter on their own', 'A heads-up the evening before, and again that morning', 'Push weeks aim your rep targets at the top of the range'], screen: 'block' },
      { kicker: 'During workouts', title: 'Guidance where you need it.', body: 'The same thinking shows up inside your workout. A line above your sets tells you when to add weight, repeat the load or back off.',
        ticks: ['Progression suggestions on each exercise', 'Based on your last sessions, not a formula', 'Deload prompts on the Today screen', 'Apply a change to your routine in one tap'], screen: 'workout' },
    ],
    faq: [
      ['Will the coach change my routines on its own?', 'No. Suggestions are only applied when you tap Apply, and you can adjust the numbers first.'],
      ['Does the coach need a connection?', 'The written note does, because it is generated for you. The in-workout suggestions work offline.'],
      ['What is a training block?', 'A run of 4 to 12 weeks that builds, pushes and then backs off, with the easy deload week booked ahead instead of waiting until you are tired. Your routines stay exactly as they are; the block only decides which weeks are light. A running block carries on even if your Premium ends.'],
      ['How often can I ask for a note?', 'There is a generous monthly allowance, more than most people will use.'],
    ],
    related: ['plans', 'progress', 'set-logging'],
  },
  {
    slug: 'progress', name: 'Progress & body', icon: 'stats-chart', c1: '#FF9A4D', c2: '#EE3F5A', pastel: '#FFEBE0', ink: '#E5552F',
    menu: 'Streaks, volume, records and body tracking',
    seoTitle: 'Workout Progress Tracker: Volume, 1RM and Body Stats | Lifty',
    seoDescription: 'Track weekly streaks, volume per muscle, estimated 1RM and records, with plateau alerts on every lift, plus body stats and private progress photos. Export any time.',
    title: 'See exactly what is working.',
    lede: 'Consistency, volume, records and your body, on screens that explain themselves. Know when to push and when to ease off.',
    main: 'progress', side: 'body',
    highlights: [
      { icon: 'analytics', title: 'This month against last', text: 'Your volume, workouts, sets and records for the last 30 days, set against the 30 before, with a bar for each recent week.', tier: 'free' },
      { icon: 'pulse', title: 'Plateau alerts', text: 'Every lift gets a trend: rising, steady, stalled or slipping. When a lift has gone weeks without a new best, or is sliding, Lifty says so and offers to plan a deload.', tier: 'premium' },
      { icon: 'flame', title: 'Weekly streaks', text: 'Hit your weekly goal and the streak grows. Your best run is kept, too.', tier: 'free' },
      { icon: 'layers', title: 'Muscle balance', text: 'Hard sets per muscle each week, against the range that keeps it growing without overreaching.', tier: 'premium' },
      { icon: 'trophy', title: 'Records and 1RM', text: 'An estimated one-rep max and a trend for every lift, plus every personal record in one list.', tier: 'free' },
      { icon: 'flag', title: 'Lift goals', text: 'Set a target for a lift and watch the bar fill as your estimated max climbs.', tier: 'premium' },
      { icon: 'body', title: 'Body measurements', text: 'Weight, waist, chest, hips, shoulders, neck, arm, thigh, calf and body fat, with trends.', tier: 'premium', tierNote: 'Body weight is free' },
      { icon: 'download', title: 'Your data, exportable', text: 'Export your whole history as a CSV any time. It is yours.', tier: 'free' },
      { icon: 'barbell', title: 'Strength levels', text: 'See where your squat, bench, deadlift, press and row sit from Beginner to Elite, and when the next level should arrive at your current pace.', tier: 'premium', tierNote: 'One lift free' },
      { icon: 'snow', title: 'Streak freezes', text: 'Every four weeks in a row earns a freeze. If a week falls one session short, a freeze keeps your streak alive.', tier: 'premium' },
      { icon: 'heart', title: 'Daily readiness', text: 'Lifty reads your sleep, heart rate variability (HRV) and resting heart rate from Apple Health and tells you how hard to push today. Tap it for what each number means, in plain English, measured against your own usual.', tier: 'premium' },
    ],
    sections: [
      { kicker: 'Training', title: 'Consistency and volume at a glance.', body: 'A weekly ring, an activity grid and volume bars show how you have been training, without spreadsheets.',
        ticks: ['Weekly streaks that reward showing up', 'A calendar grid of every training day', 'Volume per week, and per muscle', 'Milestones for the big numbers'], screen: 'progress' },
      { kicker: 'Insights', title: 'Catch a plateau before it costs you weeks.', body: 'One screen for the whole picture: how this month compares with last, and a chart for every lift that ends on where it is heading. Problems come first, so you see what needs attention before what is going well.',
        ticks: ['Last 30 days against the 30 before, with weekly bars', 'A status for every lift: rising, steady, stalled or slipping', 'A plain sentence on what is wrong, such as no new best in 5 weeks', 'A tap from a stalled lift to planning a deload block'], screen: 'insights' },
      { kicker: 'Body', title: 'Your body, too.', body: 'Log weight and measurements, and keep progress photos to compare side by side. Photos are private to you.',
        ticks: ['A weight trend with change over time', 'Nine measurements, in inches or centimeters', 'Progress photos, compared side by side', 'Private by default'], screen: 'body' },
    ],
    faq: [
      ['How does Lifty decide a lift has stalled?', 'It looks at your best estimated one-rep max from each session. If there has been no new best for four weeks or more, across at least three sessions since, the lift is stalled. If your last few sessions are clearly lower than the ones before, it is slipping. A lift needs four sessions before Lifty calls a direction.'],
      ['Can I export my data?', 'Yes. Export your workout history as a CSV from Settings, any time.'],
      ['Who can see my progress photos?', 'Only you. They are private.'],
      ['Which units does it use?', 'Pounds or kilograms, and inches or centimeters. You choose.'],
      ['What is HRV?', 'Heart rate variability is how much the time between your heartbeats varies, in milliseconds. More variation usually means a rested body, and hard training, poor sleep and stress push it down. It only means something next to your own average, so Lifty compares you with you, never with anyone else.'],
      ['Is the readiness score medical advice?', 'No. It is a guide to how hard to push, worked out on your phone from your sleep and heart data in Apple Health. It never changes your plan on its own.'],
    ],
    related: ['coach', 'challenges', 'set-logging'],
  },
  {
    slug: 'friends', name: 'Friends & feed', icon: 'people', c1: '#FF7A93', c2: '#E5334B', pastel: '#FFE4E8', ink: '#E5334B',
    menu: 'Follow your crew and cheer each other on',
    seoTitle: 'Workout Social App: Train With Friends and Share PRs | Lifty',
    seoDescription: 'Connect with friends by QR code, follow a feed of workouts and records, cheer with reactions and race a weekly leaderboard. You choose what you share.',
    title: 'Training is better with a crew.',
    lede: 'Connect with friends by QR code or friend code, see their workouts, cheer their records and get a nudge when someone cheers yours. The Lifty team’s announcements never send you a notification.',
    main: 'friends', side: 'summary',
    highlights: [
      { icon: 'qr-code', title: 'Connect in seconds', text: 'Scan a friend\'s QR code in person, or share a friend code. Requests wait for you to accept.', tier: 'free' },
      { icon: 'people', title: 'A feed of your crew', text: 'Workouts, records, photos and videos from friends, with the details that matter.', tier: 'free' },
      { icon: 'heart', title: 'Reactions and comments', text: 'Eight reactions and comments let you cheer a set without writing an essay.', tier: 'free' },
      { icon: 'trophy', title: 'Weekly leaderboard', text: 'See who trained the most this week, with streaks, and where you stand.', tier: 'free' },
      { icon: 'lock-closed', title: 'You choose what to share', text: 'Control what goes to friends, and block or report anyone, any time.', tier: 'free' },
      { icon: 'notifications', title: 'Badges and notifications', text: 'A badge on the app icon counts what is waiting: friends’ posts, comments and reactions on yours, and friend requests. Optional notifications tell you as it happens, and each kind has its own switch in Settings.', tier: 'free' },
      { icon: 'gift', title: 'Gift a month', text: 'Premium members can give a friend 30 days of Premium, up to three a month. A friend who has never had one gets the full thing, free.', tier: 'premium' },
      { icon: 'star', title: 'A Premium badge by your name', text: 'Premium members get a small gold Premium badge in the feed, in comments, on the friends list and on leaderboards, so your crew can see who is backing the app. Tap it to see what it means.', tier: 'premium' },
      { icon: 'people', title: 'Free to join', text: 'Friends, the feed, reactions, comments, challenges and the leaderboard are free for everyone, so your whole crew can join.', tier: 'free' },
    ],
    sections: [
      { kicker: 'Your crew', title: 'A feed that feels like a gym group chat.', body: 'Friends post their workouts and records, and you react in a tap. The leaderboard shows where you stand this week.',
        ticks: ['Add friends by QR code or friend code', 'Requests you accept, so nobody just sees your training', 'Eight reactions and comments on every post', 'A weekly leaderboard with streaks'], screen: 'friends' },
      { kicker: 'Share your wins', title: 'Post a record, or keep it to yourself.', body: 'When you set a record, share it as an image or post it to your friends. What you share is always your call.',
        ticks: ['Share a record outside the app, or post it to friends', 'Choose which of your workouts friends can see', 'Block and report tools built in', 'Only people you accept see your training'], screen: 'summary' },
    ],
    faq: [
      ['Who can see my workouts?', 'Only friends you have accepted, and only the workouts you choose to share.'],
      ['Can I turn sharing off?', 'Yes. Sharing is controlled in settings, and you can use Lifty entirely on your own.'],
      ['How do friend codes work?', 'Every member has a short code. Share yours or enter a friend\'s, and they can accept your request.'],
      ['Can I choose which notifications I get?', 'Yes. Settings has a switch for friends’ posts, comments on your posts, and reactions to your posts. Announcements from the Lifty team never send a notification, and you can switch them off in the feed too.'],
      ['What is the Premium badge?', 'A small gold badge beside the name of someone who subscribes to Lifty Premium. It does not change what anyone can see, and everything about the feed and friends stays free.'],
    ],
    related: ['challenges', 'studio', 'set-logging'],
  },
  {
    slug: 'challenges', name: 'Challenges', icon: 'flag', c1: '#FFC857', c2: '#F08A0C', pastel: '#FFF1D6', ink: '#D98800',
    menu: 'Goals with a finish line, solo or with friends',
    seoTitle: 'Fitness Challenges: Workout Goals With Friends | Lifty',
    seoDescription: 'Chase 13 ready-made workout challenges or build your own. Count workouts, volume, records or sets per muscle, race friends and celebrate when you finish.',
    title: 'Goals with a finish line.',
    lede: 'Pick a challenge, chase it with friends, and celebrate when you finish. Thirteen ready-made goals, or build your own.',
    main: 'challenges', side: 'friends',
    highlights: [
      { icon: 'flag', title: 'Ready-made goals', text: 'From "Four this week" to "Leg day legend" and "The 20-ton club". Pick one and go.', tier: 'free' },
      { icon: 'add', title: 'Build your own', text: 'Choose the metric, the target and the window: a week, a month or a custom stretch of days.', tier: 'free' },
      { icon: 'people', title: 'Race your friends', text: 'See how friends are doing on the same challenge, or compare with everyone.', tier: 'free' },
      { icon: 'trophy', title: 'Trophies and win cards', text: 'Finish a challenge and get a celebration, plus a card you can post to your feed.', tier: 'free' },
      { icon: 'barbell', title: 'Smarter goals', text: 'Count workouts, minutes, total volume, records, or sets and sessions for a muscle group.', tier: 'free' },
      { icon: 'calendar', title: 'Weekly and monthly', text: 'Short sprints to keep you consistent, and bigger monthly targets to keep you ambitious.', tier: 'free' },
    ],
    sections: [
      { kicker: 'Pick a goal', title: 'Make consistency a game.', body: 'Challenges turn "I should train more" into a number with a deadline. Your season shows your trophies, what is in progress and what you finished this month.',
        ticks: ['Four this week, Three this week, Twelve this month', 'Leg day legend, Chest builder, Back to basics', 'The 20-ton club, Record hunter, Five hours of iron', 'Or create your own from scratch'], screen: 'challenges' },
      { kicker: 'With friends', title: 'Better when someone is chasing you.', body: 'Join a challenge together and watch each other\'s progress. Finishing one is a moment worth sharing.',
        ticks: ['Friends and everyone boards', 'A celebration when you finish', 'Post your win to the feed', 'Challenge news without noise'], screen: 'friends' },
    ],
    faq: [
      ['How many challenges are there?', 'Thirteen ready-made challenges, plus any custom ones you build.'],
      ['Do my friends have to join?', 'No. You can chase a challenge on your own, and friends can join if they like.'],
      ['What counts toward a challenge?', 'Your logged workouts. Lifty tallies them for you, so there is nothing to track by hand.'],
    ],
    related: ['friends', 'progress', 'studio'],
  },
  {
    slug: 'studio', name: 'Lifty Studio', icon: 'film', c1: '#8B6CFF', c2: '#5B3BE8', pastel: '#ECE7FF', ink: '#5B3BE8',
    menu: 'Plan, film, edit and post gym videos',
    seoTitle: 'Gym Video App: Plan, Film and Post Workout Videos | Lifty',
    seoDescription: 'Turn your training into videos. Lifty suggests ideas from your workouts, guides each shot, helps you edit, and lets you post to friends or save to your photos.',
    title: 'Pick it. Film it. Post it.',
    lede: 'Turn your training into content. Lifty suggests ideas from your own workouts, guides each shot, and helps you edit and share, all inside the app.',
    main: 'studio', side: 'friends',
    highlights: [
      { icon: 'bulb', title: 'Ideas from your training', text: 'Video ideas built from what you actually did: a record, a form check, a weekly recap.', tier: 'premium' },
      { icon: 'videocam', title: 'Shot-by-shot guidance', text: 'Each idea breaks into short shots, with the angle and length to aim for.', tier: 'free' },
      { icon: 'film', title: 'Edit without leaving', text: 'Arrange your clips and polish the cut right in the app.', tier: 'free', tierNote: 'Extra music tracks are Premium' },
      { icon: 'paper-plane', title: 'Post where you like', text: 'Post to your friends in Lifty, or save the finished video to your photos to share anywhere.', tier: 'free' },
      { icon: 'people', title: 'Ask your friends', text: 'Form-check videos let friends weigh in on a lift from the right angle.', tier: 'free' },
      { icon: 'lock-closed', title: 'Made on your phone', text: 'Your videos are made on your phone, and you decide what gets shared.', tier: 'free', tierNote: 'Cloud backup of clips is Premium' },
    ],
    sections: [
      { kicker: 'Pick, film, post', title: 'Your first video takes about ten minutes.', body: 'No editing background needed. Start with an idea from your own training, film it in a few short shots, and post it.',
        ticks: ['Video ideas built from your real training', 'Shot-by-shot filming guidance', 'Edit and post without leaving the app', 'Save the final cut to your photos'], screen: 'studio' },
      { kicker: 'Share', title: 'Let your crew in on it.', body: 'Posted videos show up in your friends\' feeds next to workouts and records, where they can react and comment.',
        ticks: ['Videos appear in the friends feed', 'Reactions and comments from your crew', 'Form checks with feedback from friends', 'You choose who sees it'], screen: 'friends' },
    ],
    faq: [
      ['Do I need to be a content creator?', 'Not at all. Studio is built for people who just want to share a good lift or a recap with friends.'],
      ['Does it cost extra?', 'No. Lifty Studio is included with every plan.'],
      ['Where do my videos live?', 'They are made on your phone. You choose whether to post them to friends or save them to your photos.'],
    ],
    related: ['friends', 'challenges', 'set-logging'],
  },
  {
    slug: 'watch', name: 'Apple Watch & widgets', icon: 'watch', c1: '#4C7DFF', c2: '#1B2F66', pastel: '#E4EAFB', ink: '#2C4CB5',
    menu: 'Log from your wrist and your lock screen',
    seoTitle: 'Apple Watch Workout App That Works Without Your iPhone | Lifty',
    seoDescription: 'Run a whole workout from your Apple Watch with your phone left at home, log a set with a tap, and keep your week on your lock screen with widgets and a Live Activity.',
    title: 'Leave the phone in your bag.',
    lede: 'Start a routine from your Apple Watch and log every set with a tap, even with your iPhone at home. Lock screen and home screen widgets keep your week in view, and everything lands in your history when you are back in range.',
    main: 'today',
    highlights: [
      { icon: 'watch', title: 'Works without your iPhone', text: 'Start a routine or repeat your last workout from the watch, with the phone at home. Weights, last-time numbers, records and rest all work on the wrist.', tier: 'free' },
      { icon: 'sync-outline', title: 'Sent home when you are back', text: 'The finished workout is saved on the watch and in Apple Health, then sent to your iPhone when it is near. Records, challenges and your history update, and nothing is counted twice.', tier: 'free' },
      { icon: 'watch', title: 'Tap to log a set', text: 'Log a set with a tap or double tap on your Apple Watch, and keep your phone in your bag.', tier: 'free' },
      { icon: 'notifications', title: 'A buzz when rest ends', text: 'Choose how your wrist tells you it is time for the next set.', tier: 'free' },
      { icon: 'phone-portrait', title: 'Live Activity', text: 'Your workout stays on the lock screen, with progress at a glance.', tier: 'free' },
      { icon: 'apps', title: 'Home screen widgets', text: 'A Today widget shows your next workout, your week and, if you are in a training block, where you are in it. A medium size adds a Start button.', tier: 'free' },
      { icon: 'lock-closed', title: 'Lock screen widgets', text: 'A ring of your week, your next workout, or a Streak widget of its own, right on the lock screen and in StandBy. Tap one and Lifty starts your workout.', tier: 'free' },
      { icon: 'flash', title: 'Installs in a tap', text: 'If a watch is paired, Lifty offers to put the app on it during setup.', tier: 'free' },
      { icon: 'sync-outline', title: 'Always in step', text: 'With your phone near, what you log on the watch lands in the same workout on your phone, live.', tier: 'free' },
    ],
    sections: [
      { kicker: 'On your wrist', title: 'A whole workout, no phone needed.', body: 'Your routines live on the watch, laid out set by set the way the phone would start them. Pick one, tap to log each set, and Lifty handles rest, plates, warm-ups and records right on your wrist.',
        ticks: ['Start a routine, or repeat your last workout, from the watch', 'Last time, suggested weights and plates for the bar', 'Records celebrated on your wrist, with a haptic buzz', 'Saved to Apple Health, then sent to your iPhone when it is near'], visual: 'watch' },
      { kicker: 'On your lock screen', title: 'Your week, always in view.', body: 'Widgets put your next workout and your streak on the home screen, the lock screen and StandBy, and a Live Activity follows your session while you train.',
        ticks: ['Today and Streak widgets, in small, medium and lock screen sizes', 'A Start button on the medium widget', 'Your training block week, when you are in one', 'A Live Activity during your workout'], visual: 'lock' },
    ],
    faq: [
      ['Is there an Android watch app?', 'The Apple Watch app is part of the iPhone version of Lifty.'],
      ['Do I need my iPhone nearby?', 'Not to train. Open Lifty on your iPhone once near the watch so it can copy your routines over, and after that you can leave the phone behind. With the phone near, it runs the workout and both screens stay in step. Without it, the watch runs the workout itself and sends it home later.'],
      ['Can I start any workout from the watch?', 'Any of your routines, or a repeat of your last workout. Building a brand-new workout by picking exercises still happens on your iPhone. If you change a routine on your phone, the watch picks up the change the next time they are together, and says so when its copy is getting old.'],
      ['Do I need the watch to use Lifty?', 'No. Everything works from your phone. The watch is a convenience.'],
      ['Can I choose how a set is logged?', 'Yes. Choose a tap or a double tap in settings, and pick how rest-over buzzes.'],
    ],
    related: ['set-logging', 'progress', 'plans'],
  },
];

export const bySlug = (slug: string) => features.find((f) => f.slug === slug)!;
