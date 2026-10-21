// CHANGE VERSION: PORTFOLIO-SALT-LIGHT-R1 | Salt & Light case study from the uploaded app
const portfolioHeartFeedback = {
  approach: 'Keep the portfolio deployable as static files, with heart feedback handled entirely in the browser for the current visit.',
  feature: 'An animated header heart with a smooth thank-you response, without accounts or a saved count',
  tag: 'REACT / FEEDBACK',
  description: 'The header heart responds with a pulse and a smooth thank-you message. Its state lasts for the current visit and resets on refresh; no shared count or database connection is used.',
};

export const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/glenn-bernard-pimentel-2b3461265/",
  },
  { name: "GitHub", href: "https://github.com/gbppimentel-dev" },
];

// Personal navigation icons stay visible; empty URLs show an unconnected state.
export const menuSocialLinks = [
  { name: 'Facebook', icon: 'facebook', href: '' },
  { name: 'Messenger', icon: 'messenger', href: '' },
  { name: 'Instagram', icon: 'instagram', href: '' },
  { name: 'X', icon: 'x', href: '' },
];

// Add real screenshots under public/images/projects, then set screenshot below.
// URLs stay empty until you provide the real destination. No fake links are shown.
export const projects = [
  {
    id: 'salt-and-light', title: 'Salt & Light', category: 'Web development',
    description: 'Everyday goals. Daily reflection. A character that grows with you.',
    status: 'Live web application', accent: 'amber', artwork: 'images/slide02.png',
    screenshot: 'images/projects/salt-light-login-r1.png',
    liveUrl: 'https://salt-light.vercel.app/', liveLabel: 'Open Salt & Light',
    sourceUrl: 'https://github.com/gbppimentel-dev/salt-light',
    details: 'A Christian life tracker that connects intentional habits, devotion, and RPG progression in one app, with friends, achievements, and an installable web experience.',
    technologies: ['react', 'vite', 'javascript', 'html', 'css', 'tailwind', 'shadcn', 'framer-motion', 'react-query', 'supabase', 'postgresql', 'react-router', 'lucide', 'date-fns', 'html2canvas', 'pwa', 'capacitor', 'api-bible', 'vercel'],
    caseStudy: {
      role: 'Application development & interface design',
      focus: 'Faith-centered productivity & RPG progression',
      scope: 'React web app, Supabase integration & PWA',
      challenge: 'Bring task planning, daily reflection, and long-term growth into one place. Make progress feel rewarding while keeping the everyday actions clear: plan a goal, complete it, reflect, and return.',
      approach: 'Organise goals, character development, devotion, and connections into distinct workspaces. Use Supabase for sessions and records, React Query for cached server state, and shared progression rules to connect completed actions with XP and Faith. Keep date copying explicit and give failed updates a clear recovery path.',
      features: [
        'Daily, Weekly, Elite, and Boss Fight goals with due dates, calendar views, and an archive',
        'XP, Faith, levels, jobs, equipment, and unlockable character skills',
        'Bible passage selection, devotion journaling, monthly calendars, and PNG exports',
        'Searchable achievements with categories, rarity, and progress states',
        'Friend discovery through public IDs and consistent relationship checks',
        'A friend-request inbox with a synchronised navigation badge',
        'Google sign-in, installable PWA support, and native packaging configuration',
      ],
      featureDetails: [
        { title: 'Everyday goals, turned into quests', tag: 'GOALS / PLANNING', description: 'Plan Daily, Weekly, Elite, and Boss Fight goals, choose due dates, review calendar views, and keep completed tasks in an archive. Copy a goal to chosen dates when needed.' },
        { title: 'A character that grows with the work', tag: 'CHARACTER / PROGRESSION', description: 'Completed goals contribute XP and Faith. Levels, job paths, equipment, and unlockable skills give that progress a character of its own, with shared rules for rewards and requirements.' },
        { title: 'A place for daily reflection', tag: 'DEVOTION / JOURNAL', description: 'Choose a Bible passage, write a reflection, and revisit entries in a monthly calendar. Streaks and Faith rewards add feedback, while image exports make selected entries easy to keep.' },
        { title: 'Milestones beyond a single task', tag: 'ACHIEVEMENTS / PROGRESS', description: 'Browse achievements across goals, devotion, character levels, equipment, and skills. Search, categories, rarity labels, and progress bars help make the next milestone clear.' },
        { title: 'Find people through a public ID', tag: 'FRIENDS / CONNECTIONS', description: 'Look up another character, send a request, and browse accepted friends. Relationship checks recognise both sides of a connection so the same friendship is handled consistently.' },
        { title: 'An inbox that stays in sync', tag: 'MAIL / FEEDBACK', description: 'Accept or decline incoming friend requests from Mail. A shared refresh event keeps the navigation badge aligned with those actions and updates it when the app regains focus.' },
        { title: 'An app you can come back to', tag: 'AUTH / DELIVERY', description: 'Google sign-in leads into a responsive, route-based app. Its manifest and service worker support installation as a PWA; the source also includes Android and iOS packaging configuration through Capacitor.' },
      ],
      technologyNotes: [
        { technology: 'react', role: 'Reusable app screens, component state, and shared character and authentication hooks.' },
        { technology: 'vite', role: 'Local development and production bundling for the React application.' },
        { technology: 'javascript', role: 'Progression rules, entity adapters, date handling, and interaction logic.' },
        { technology: 'html', role: 'Semantic page structure, forms, navigation, and accessible controls.' },
        { technology: 'css', role: 'Shared green-and-gold design tokens, typography, and theme styling.' },
        { technology: 'tailwind', role: 'Responsive layouts, card styling, spacing, and interactive state classes.' },
        { technology: 'shadcn', role: 'Customisable UI components built on Radix primitives, including tabs, dialogs, and inputs.' },
        { technology: 'framer-motion', role: 'Page transitions, character and goal feedback, and animated state changes.' },
        { technology: 'react-query', role: 'Server-state caching, query refreshes, mutations, and optimistic updates.' },
        { technology: 'supabase', role: 'Account sessions, Google sign-in, persistent app records, and database RPC calls.' },
        { technology: 'postgresql', role: 'Relational records for characters, goals, devotion entries, and friendships.' },
        { technology: 'react-router', role: 'Protected app routes and navigation between the main workspaces.' },
        { technology: 'lucide', role: 'Consistent icons for goals, character tools, devotion, and navigation.' },
        { technology: 'date-fns', role: 'Calendar boundaries, date comparisons, due dates, and readable date labels.' },
        { technology: 'html2canvas', role: 'PNG exports of rendered character profiles and devotion views.' },
        { technology: 'pwa', role: 'Manifest, service worker registration, automatic updates, and standalone display configuration.' },
        { technology: 'capacitor', role: 'Included Android and iOS project configuration for packaging the web application.' },
        { technology: 'api-bible', role: 'Bible translation selection and passage lookups within the devotion flow.' },
        { technology: 'vercel', role: 'Hosting for the live web application.' },
      ],
      outcome: 'A deployed app bringing goals, devotion, character development, achievements, and friend requests into one connected experience. Its source includes installable PWA support and native project configuration, alongside the web interface.',
      screens: [
        { label: 'Welcome', src: 'images/projects/salt-light-login-r1.png', alt: 'Salt & Light sign-in screen from the uploaded build, with its green welcome panel and Google sign-in option.', caption: 'The welcome screen, captured from the uploaded local build. No sign-in or account creation was performed.' },
        { label: 'Character creation', src: 'images/projects/salt-light-character-setup-r1.png', alt: 'Salt & Light character creation component with its wizard illustration, name field, and start button.', caption: 'Character creation: a read-only local component preview from the app source, without creating a character.' },
        { label: 'Devotion calendar', src: 'images/projects/salt-light-devotion-calendar-r1.png', alt: 'Salt & Light monthly devotion calendar in its empty state, rendered from the actual component.', caption: 'The devotion calendar: an empty-state local component preview, with no personal journal records.' },
      ],
    },
  },
  {
    id: 'lifecity-attendance', title: 'LifeCity Attendance', category: 'Web development',
    description: 'Member records, QR check-in, and attendance reporting for the LifeCity community.',
    status: 'Live web application', accent: 'blue', artwork: 'images/slide01.png',
    screenshot: 'images/projects/lifecity-attendance-welcome-r1.png',
    liveUrl: 'https://lifecity-attendance.vercel.app/',
    sourceUrl: 'https://github.com/gbppimentel-dev/lifecity-attendance',
    details: 'An end-to-end attendance workflow with guest browsing, member self-service, and dedicated administrator and owner workspaces.',
    technologies: ['react', 'typescript', 'vite', 'supabase', 'postgresql', 'html5-qrcode', 'qrcode-react', 'papaparse', 'lucide', 'html', 'css', 'vercel'],
    caseStudy: {
      role: 'Application development', focus: 'Attendance & member management', scope: 'React app & Supabase integration',
      challenge: 'Bring registration, service check-in, and attendance history into one connected workflow. Members need a simple way to access their QR ID, while the church team needs clear tools for maintaining records and preparing reports.',
      approach: 'Build role-specific React and TypeScript workspaces around Supabase Auth, PostgreSQL, and Realtime. Pair camera scanning with manual check-in, review imported data before saving, and validate complete report exports across every page of results.',
      features: [
        'Camera QR scanning, manual check-in, and a fullscreen kiosk',
        'Member profiles, personal QR codes, and downloadable PNG IDs',
        'Service management, attendance history, and live dashboard updates',
        'CSV import validation, duplicate review, and complete report exports',
        'Google sign-in with member, administrator, and owner workspaces',
        'Reviewed account linking, profile change requests, and feedback tickets',
      ],
      outcome: 'A deployed web app connecting member records, service check-in, and attendance reporting in one place. Members can access their own information, while the church team has dedicated tools for day-to-day administration.',
      screens: [
        {
          src: 'images/projects/lifecity-attendance-welcome-r1.png',
          alt: 'LifeCity Attendance welcome screen with community illustrations, Google sign-in, and guest access.',
          caption: 'The welcome experience: Google sign-in for members and a guest route to explore public gatherings.',
        },
        {
          src: 'images/projects/lifecity-attendance-stack-r1.png',
          alt: 'LifeCity Attendance technology index with a selected React entry and an explanation of its role in the application.',
          caption: 'Under the hood: an interactive technology index explaining the tools and platform features behind the app.',
        },
      ],
    },
  },
  {
    id: 'gbppimentel-dev', title: 'gbppimentel-dev', category: 'Web development',
    description: 'A professional portfolio with a playful interface, expressive motion, and practical technical detail.',
    status: 'You are exploring it', accent: 'coral', artwork: 'images/slide03.png',
    screenshot: 'images/projects/gbppimentel-dev-hero-r4.png',
    liveUrl: '#home', liveLabel: 'Explore portfolio', sourceUrl: 'https://github.com/gbppimentel-dev/gbppimentel-dev',
    details: 'Development, design, and NetSuite experience brought together through an animated landing page, a tactile 3D identity card, and project-specific case studies.',
    technologies: ['react', 'vite', 'javascript', 'html', 'css', 'gsap', 'motion', 'swiper', 'three', 'github-pages', 'github-actions'],
    caseStudy: {
      role: 'Development & interface design', focus: 'Creative portfolio & interaction design', scope: 'React frontend & static deployment',
      challenge: 'Present development, design, and NetSuite experience in one clear professional identity. Make the work easy to explore while giving the portfolio enough character to demonstrate the same care put into its projects.',
      approach: 'Build the experience as focused React components around a shared paper-and-ink visual system. Use Swiper for the hero, GSAP and Motion for coordinated interactions, and Three.js for the identity card. ' + portfolioHeartFeedback.approach,
      features: [
        'Three hero slides with terminal typing, rotating words, decryption, and replaying text reveals',
        'A draggable, flippable Three.js identity card with a simulated strap and adaptive colors',
        'Continuous overlapping sections, animated ribbon separators, and a staggered navigation panel',
        'An accordion project gallery with preview transitions, technology explanations, and individual case studies',
        'Shared amber, blue, and coral accents across loaders, controls, backgrounds, and the identity card',
        portfolioHeartFeedback.feature,
      ],
      featureDetails: [
        {
          title: 'Typography that does something', tag: 'HERO / MOTION',
          description: 'The landing page combines a measuring-box wordmark, terminal typing, independently rotating design and development terms, and a decrypting systems headline. Carousel playback has its own pause control and countdown bar.',
        },
        {
          title: 'An identity you can move', tag: 'THREE.JS / INTERACTION',
          description: 'The ID can be dragged, released, and flipped. A custom strap and rigid-body simulation gives it weight, while its material colors follow the shared palette without resetting the movement.',
        },
        {
          title: 'Sections with a sense of depth', tag: 'SCROLL / NAVIGATION',
          description: 'About and Contact move over the preceding section during continuous scrolling. Their animated ribbons stop below the fixed navigation, while the staggered menu leaves the underlying page available to explore.',
        },
        {
          title: 'A collection of different worlds', tag: 'PROJECTS / CASE STUDIES',
          description: 'Hovering the accordion previews a project and its tools; selecting it moves to the case study. The collection frame and dedicated notes can adopt the project’s own visual identity, supported by real build screenshots and direct links.',
        },
        {
          title: 'One palette, many small details', tag: 'VISUAL SYSTEM / FEEDBACK',
          description: 'Amber, blue, and coral move through the site as a shared accent. Loader echoes, menu hovers, custom pointer effects, bento interactions, and button reveals add feedback without changing the underlying navigation.',
        },
        {
          title: 'A small response, right away', tag: portfolioHeartFeedback.tag,
          description: portfolioHeartFeedback.description,
        },
      ],
      technologyNotes: [
        { technology: 'react', role: 'Component structure, interactive state, and hash-based page composition.' },
        { technology: 'vite', role: 'Local development, production bundling, and deployment base paths.' },
        { technology: 'javascript', role: 'Interaction logic, animation controllers, and browser integrations.' },
        { technology: 'html', role: 'Semantic sections, accessible controls, and navigation landmarks.' },
        { technology: 'css', role: 'The paper-and-ink identity, responsive layouts, and shared accent system.' },
        { technology: 'gsap', role: 'Accordion transitions and animated text-loop ribbons.' },
        { technology: 'motion', role: 'Layout transitions, rotating text, blur reveals, and project-note changes.' },
        { technology: 'swiper', role: 'Hero slide navigation, autoplay, parallax, and keyboard support.' },
        { technology: 'three', role: 'The 3D ID, textured card surfaces, lighting, and simulated strap rendering.' },
        { technology: 'github-pages', role: 'Static hosting for the built portfolio under its repository base path.' },
        { technology: 'github-actions', role: 'Automated production builds and deployment from the main branch.' },
      ],
      deployment: {
        platform: 'GitHub Pages', automation: 'GitHub Actions',
        description: 'The default branch triggers a production build and publishes its static output with the deployed base path. The portfolio and its header-heart interaction run without a backend connection.',
      },
      outcome: 'A live desktop-first portfolio where the interface itself demonstrates the work: development, visual design, motion, and responsive interaction. Visitors can explore the projects, open the source, view the résumé, and start a professional conversation through LinkedIn.',
      screens: [
        {
          src: 'images/projects/gbppimentel-dev-hero-r4.png',
          alt: 'The gbppimentel-dev landing page with its paper-and-ink hero frame, terminal print line, and carousel controls.',
          caption: 'The opening frame: development, design, and ERP solutions with a measured wordmark and terminal-inspired introduction.',
        },
        {
          src: 'images/projects/gbppimentel-dev-creative-r4.png',
          alt: 'The creative hero slide with styled rotating design and development terms in a connected workbench frame.',
          caption: 'Creative typography: independently rotating words, distinct type treatments, and smoothly changing layouts.',
        },
        {
          src: 'images/projects/gbppimentel-dev-about-r4.png',
          alt: 'The About section with its interactive lanyard identity card, profile bento, skill branches, and moving ribbon.',
          caption: 'A tactile profile: an interactive 3D identity card alongside readable skills and a branching explorer.',
        },
        {
          src: 'images/projects/gbppimentel-dev-menu-r4.png',
          alt: 'The staggered navigation panel with the portfolio still visible behind its paper-style menu cards.',
          caption: 'Navigation with context: an animated menu that keeps part of the site visible and available to scroll.',
        },
      ],
    },
  },
];

export const contact = {
  title: 'LET’S CREATE SOMETHING.',
  description: 'Have an idea, a project, or an opportunity in mind? Let’s talk.',
  email: '', // Your public contact email; leave empty to use LinkedIn instead.
  linkedin: 'https://www.linkedin.com/in/glenn-bernard-pimentel-2b3461265/',
};
// END OF FILE: PORTFOLIO-SALT-LIGHT-R1 | data.js
