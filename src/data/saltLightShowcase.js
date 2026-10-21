// CHANGE VERSION: PORTFOLIO-SALT-LIGHT-R2 | Actual Salt & Light screens and feature chapters
// These are supplied app captures. Visible account progress is example app state,
// not project usage, performance, or success metrics.
const imageRoot = 'images/projects/salt-light-r2/';

export const saltShowcaseScreens = [
  {
    id: 'welcome', label: 'Welcome', src: imageRoot + 'welcome.png',
    alt: 'Salt & Light desktop welcome screen with a green introduction and Google sign-in card.',
    caption: 'The desktop welcome: a calm introduction, Google sign-in, and a clear next step.',
    group: 'welcome', layout: 'desktop', width: 1182, height: 691,
  },
  {
    id: 'onboarding', label: 'A quick introduction', src: imageRoot + 'onboarding.png',
    alt: 'Salt & Light onboarding step explaining goals, XP, Faith, levels, equipment, and skills.',
    caption: 'A short guided tour introduces how daily actions connect to character growth.',
    group: 'welcome', layout: 'panel', width: 475, height: 353,
  },
  {
    id: 'devotion-tour', label: 'Devotion, explained', src: imageRoot + 'devotion-tour.png',
    alt: 'Salt & Light guided-tour card describing the devotion journal and streak bonuses.',
    caption: 'The devotion tour explains reflection, consistency, and the rewards along the way.',
    group: 'devotion', layout: 'panel', width: 466, height: 367,
  },
  {
    id: 'devotion', label: 'Daily devotion', src: imageRoot + 'devotion.png',
    alt: 'Salt & Light mobile devotion view with Bible passage selectors, a passage preview, and XP and Faith rewards.',
    caption: 'The mobile devotion view: select a passage, preview the text, and begin a reflection.',
    group: 'devotion', layout: 'phone', width: 573, height: 717,
  },
  {
    id: 'devotion-calendar', label: 'A month of reflection', src: imageRoot + 'devotion-calendar.png',
    alt: 'Salt & Light monthly devotion calendar with completed days and the mobile navigation bar.',
    caption: 'A monthly calendar makes past entries easy to revisit, with completed days clearly marked.',
    group: 'devotion', layout: 'phone', width: 408, height: 549,
  },
  {
    id: 'goals', label: 'Goals & quests', src: imageRoot + 'goals.png',
    alt: 'Salt & Light mobile Goals screen with Daily, Weekly, Elite, and Boss tabs, a calendar, task archive, and bottom navigation.',
    caption: 'Goals on mobile: quest types, dates, an archive, and the main navigation in one compact screen.',
    group: 'mobile', layout: 'phone', width: 407, height: 840,
  },
  {
    id: 'achievements', label: 'Milestones & bonuses', src: imageRoot + 'achievements.png',
    alt: 'Salt & Light achievement progress and a list of active skill bonuses.',
    caption: 'Achievement progress and active skill bonuses bring longer-term milestones into view.',
    group: 'character', layout: 'panel', width: 405, height: 321,
  },
  {
    id: 'feedback', label: 'Feedback & bug reports', src: imageRoot + 'feedback.png',
    alt: 'Salt & Light mobile feedback form with category, subject, message, and a green send button.',
    caption: 'A dedicated mobile form gives people a place to report an issue or share an idea.',
    group: 'mobile', layout: 'phone', width: 446, height: 835,
  },
  {
    id: 'dashboard', label: 'Your daily overview', src: imageRoot + 'dashboard.png',
    alt: 'Salt & Light mobile dashboard crop showing level progress, goal summaries, today’s goals, and recent activity.',
    caption: 'The mobile dashboard brings character progress, today’s goals, and recent activity together.',
    group: 'mobile', layout: 'phone', width: 443, height: 682,
  },
  {
    id: 'equipment', label: 'Equipment shop', src: imageRoot + 'equipment.png',
    alt: 'Salt & Light equipment shop with pastel item cards, equipment categories, bonuses, and class requirements.',
    caption: 'Equipment adds another layer to progression: item types, useful bonuses, and job requirements.',
    group: 'character', layout: 'desktop', width: 882, height: 586,
  },
  {
    id: 'jobs', label: 'Choose a job path', src: imageRoot + 'jobs.png',
    alt: 'Salt & Light tiered job tree with Seeker, Warrior, Scholar, Devotee, Knight, and Berserker paths.',
    caption: 'The job tree makes level gates, prerequisites, and each path’s bonuses visible before a change.',
    group: 'character', layout: 'desktop', width: 1025, height: 880,
  },
  {
    id: 'skills', label: 'Build your skill set', src: imageRoot + 'skills.png',
    alt: 'Salt & Light skill tree with job filters, available skill points, unlocked abilities, and their bonuses.',
    caption: 'Skills connect character choices to everyday progress, with unlocked abilities gathered below.',
    group: 'character', layout: 'desktop', width: 1008, height: 456,
  },
];

export const saltFeatureChapters = [
  {
    id: 'quests', label: 'Quests', icon: 'target', tone: 'mint',
    title: 'Give everyday goals a little adventure.',
    description: 'A goal can be a small daily habit, a longer commitment, or a bigger challenge. The calendar keeps the next action clear while completed work contributes to character growth.',
    screenIds: ['goals', 'dashboard'],
    highlights: ['Daily, Weekly, Elite & Boss Fight goals', 'Due dates, calendar views & task archive', 'XP and Faith connect actions to progression'],
  },
  {
    id: 'devotion', label: 'Devotion', icon: 'book', tone: 'gold',
    title: 'Make room for daily reflection.',
    description: 'Passage selection, journaling, and a monthly view form one connected reflection flow. Rewards and streak feedback sit alongside the entry, rather than getting in its way.',
    screenIds: ['devotion', 'devotion-calendar', 'devotion-tour'],
    highlights: ['Bible passage selection & preview', 'A journal with monthly progress', 'Streaks, Faith rewards & PNG exports'],
  },
  {
    id: 'character', label: 'Character', icon: 'layers', tone: 'lilac',
    title: 'Progress that becomes your own.',
    description: 'Levels open job paths, equipment adds bonuses, and skill points unlock useful abilities. Clear requirements make the connection between daily effort and character choices visible.',
    screenIds: ['equipment', 'jobs', 'skills'],
    highlights: ['Equipment with job requirements', 'Tiered job paths & level gates', 'Skills and bonuses that carry forward'],
  },
  {
    id: 'milestones', label: 'Milestones', icon: 'shield', tone: 'rose',
    title: 'See the bigger journey taking shape.',
    description: 'Achievements collect progress across goals, devotion, levels, and character choices. Search, categories, rarity, and progress states help make the next milestone easy to find.',
    screenIds: ['achievements'],
    highlights: ['Searchable achievement collection', 'Categories, rarity & progress states', 'Active skill bonuses in one place'],
  },
  {
    id: 'connections', label: 'Connections', icon: 'users', tone: 'mint',
    title: 'A personal journey, with room for others.',
    description: 'Public IDs make it possible to find another character and send a friend request. Incoming requests live in Mail, with a navigation badge that stays aligned as requests are handled.',
    screenIds: ['onboarding'],
    highlights: ['Find characters by public ID', 'Send, accept & decline friend requests', 'A shared refresh keeps the request badge in sync'],
  },
  {
    id: 'feedback', label: 'Feedback', icon: 'spark', tone: 'gold',
    title: 'Give ideas and issues a clear home.',
    description: 'The app includes a dedicated feedback and bug-report form. Its category, subject, and message fields give people a straightforward way to explain what they need.',
    screenIds: ['feedback'],
    highlights: ['A dedicated feedback & bug-report screen', 'Category, subject & message fields', 'A compact form that fits the mobile layout'],
  },
  {
    id: 'everywhere', label: 'Web & mobile', icon: 'screen', tone: 'lilac',
    title: 'From your browser to your home screen.',
    description: 'Salt & Light adapts to a desktop workspace or a phone’s smaller screen. As an installable web app, it can also be added to the home screen on Android and iOS.',
    screenIds: ['welcome', 'goals'],
    highlights: ['Responsive desktop & mobile layouts', 'Installable on Android & iOS', 'Google sign-in & mobile bottom navigation'],
  },
];
// END OF FILE: PORTFOLIO-SALT-LIGHT-R2 | saltLightShowcase.js
