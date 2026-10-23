// CHANGE VERSION: PORTFOLIO-LIFECITY-R2 | Verified LifeCity desktop and mobile case-study content
import { saltShowcaseScreens } from './data/saltLightShowcase.js';
import { lifeCityScreens } from './data/lifeCityShowcase.js';
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
    id: 'salt-and-light', title: 'Salt & Light', category: 'Web & Mobile App',
    description: 'Everyday goals, daily reflections, & a character that grows with you.',
    status: 'Web · Android · iOS', accent: 'amber', artwork: 'images/slide02.png',
    screenshot: 'images/projects/salt-light-r2/welcome.png',
    liveUrl: 'https://salt-light.vercel.app/', liveLabel: 'Open Salt & Light',
    sourceUrl: 'https://github.com/gbppimentel-dev/salt-light',
    details: 'A Christian personal growth app that brings goal planning, devotion journaling, and RPG progression together. Complete meaningful actions, earn rewards, and develop a character through levels, job paths, equipment, and skills.',
    technologies: ['react', 'vite', 'javascript', 'html', 'css', 'tailwind', 'shadcn', 'framer-motion', 'react-query', 'supabase', 'postgresql', 'react-router', 'lucide', 'date-fns', 'html2canvas', 'pwa', 'capacitor', 'api-bible', 'vercel'],
    caseStudy: {
      role: 'Application Development, Maintenance, & Interface Design',
      focus: 'Personal Growth & Daily Planning',
      scope: 'Responsive Web & Mobile · Installable PWA',
      challenge: 'I struggle to stay in a routine, and I often feel lost about what to do next. My love of games has always drawn me to quests and challenges, so I wondered: what if I brought that same motivation into everyday life? Salt & Light grew from that question, with room to get things done and deepen my faith along the way.',
      approach: 'I wanted each meaningful action to give something back. Rewards, character growth, and visible feedback turn everyday effort into progress I can see. The experience works as a solo journey, with room to add friends and share it with others along the way.',
      features: [
        'Daily, Weekly, Elite, and Boss Fight goals with due dates, calendar views, and an archive',
        'XP, Faith, levels, jobs, equipment, and unlockable character skills',
        'Bible passage selection, devotion journaling, monthly calendars, and PNG exports',
        'Searchable achievements with categories, rarity, and progress states',
        'Friend discovery through public IDs and consistent relationship checks',
        'A friend-request inbox with a synchronised navigation badge',
        'Google sign-in, responsive mobile layouts, and Android and iOS home-screen installation',
        'A dedicated feedback and bug-report form with categories, subject, and message fields',
      ],
      featureDetails: [
        { title: 'Everyday goals, turned into quests', tag: 'GOALS / PLANNING', description: 'Plan Daily, Weekly, Elite, and Boss Fight goals, choose due dates, review calendar views, and keep completed tasks in an archive. Copy a goal to chosen dates when needed.' },
        { title: 'A character that grows with the work', tag: 'CHARACTER / PROGRESSION', description: 'Completed goals contribute XP, with Faith bonuses available through character abilities. Levels, job paths, equipment, and unlockable skills give that progress a character of its own, with shared rules for rewards and requirements.' },
        { title: 'A place for daily reflection', tag: 'DEVOTION / JOURNAL', description: 'Choose a Bible passage, write a reflection, and revisit entries in a monthly calendar. Streaks and Faith rewards add feedback, while image exports make selected entries easy to keep.' },
        { title: 'Milestones beyond a single task', tag: 'ACHIEVEMENTS / PROGRESS', description: 'Browse achievements across goals, devotion, character levels, equipment, and skills. Search, categories, rarity labels, and progress bars help make the next milestone clear.' },
        { title: 'Find people through a public ID', tag: 'FRIENDS / CONNECTIONS', description: 'Look up another character, send a request, and browse accepted friends. Relationship checks recognise both sides of a connection so the same friendship is handled consistently.' },
        { title: 'An inbox that stays in sync', tag: 'MAIL / FEEDBACK', description: 'Accept or decline incoming friend requests from Mail. A shared refresh event keeps the navigation badge aligned with those actions and updates it when the app regains focus.' },
        { title: 'An app you can come back to', tag: 'WEB / ANDROID / iOS', description: 'Google sign-in leads into a responsive app with a compact mobile navigation. Install it on Android or iOS through the browser to keep it on your home screen. The source also includes Capacitor packaging configuration.' },
        { title: 'A place for ideas and issues', tag: 'FEEDBACK / SUPPORT', description: 'A dedicated feedback and bug-report form brings category, subject, and message fields together in the mobile layout.' },
      ],
      outcome: 'I built this for people like me who struggle to focus and keep a routine. I want Salt & Light to make it easier to begin, see progress, and find a reason to keep going. The purpose is to help and motivate, while making room for faith and personal growth.',
      screens: saltShowcaseScreens,
    },
  },
  {
    id: 'lifecity-attendance', title: 'LifeCity Attendance', category: 'Web & Mobile App',
    description: 'Member records, QR check-in, and a clearer picture of every gathering.',
    status: 'Live Web App', accent: 'blue', artwork: 'images/slide01.png',
    screenshot: 'images/projects/lifecity-r2/welcome-desktop.png',
    liveUrl: 'https://lifecity-attendance.vercel.app/', liveLabel: 'Open LifeCity',
    sourceUrl: 'https://github.com/gbppimentel-dev/lifecity-attendance',
    details: 'A responsive church attendance app with guest access, member self-service, service management, camera scanning, and administrative reporting. Desktop tools and compact mobile workspaces share the same connected records.',
    technologies: ['react', 'typescript', 'javascript', 'vite', 'supabase', 'postgresql', 'html5-qrcode', 'qrcode-react', 'papaparse', 'lucide', 'html', 'css', 'web-apis', 'web-manifest', 'vercel'],
    caseStudy: {
      role: 'Application Development, Maintenance, & Interface Design',
      focus: 'Community Attendance & Member Management',
      scope: 'Responsive Web & Mobile · Home-Screen Support',
      challenge: 'I wanted our church’s attendance process to be easier to manage, from welcoming someone new to checking them in at a service. Member records, personal QR IDs, and attendance history need to stay connected, while members and the church team each get a clear place to work.',
      approach: 'I built separate journeys for guests, members, administrators, and the owner, connected through the same records. Check-in supports both a camera and a manual fallback. Imports are reviewed before saving, account-link requests are handled explicitly, and reports gather every matching row before export.',
      features: [
        'QR camera scanning, manual check-in, duplicate feedback, and a fullscreen kiosk',
        'Member profiles, ministries and churches, private QR tokens, and downloadable PNG IDs',
        'Service scheduling, three-hour live status, attendance history, and realtime dashboard refreshes',
        'Reviewed CSV imports with mapping, validation, and duplicate checks',
        'Complete member and attendance exports with progress, cancellation, and count validation',
        'Google sign-in, member self-service, reviewed account linking, and role-specific workspaces',
        'Responsive desktop and phone layouts, appearance controls, and motion preferences',
        'Feedback tickets with owner review and clear identity-display choices',
      ],
      outcome: 'LifeCity Attendance brings member profiles, gatherings, QR check-in, and reporting into one responsive web app. Members can access their own QR and attendance, while the church team manages day-to-day records. The goal is a dependable tool that keeps the focus on the people behind each check-in.',
      screens: lifeCityScreens,
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
// END OF FILE: PORTFOLIO-LIFECITY-R2 | data.js
