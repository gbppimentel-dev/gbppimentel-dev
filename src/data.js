// CHANGE VERSION: HEARTS-CLOUDFLARE-R5 | Case-study tools follow the configured heart service
import { getPortfolioHeartsConfig } from './utils/portfolioHearts.js';

const heartConfig = getPortfolioHeartsConfig();
const cloudflareHearts = heartConfig.configured && heartConfig.provider === 'cloudflare';
const portfolioHeartBackend = cloudflareHearts ? {
  tools: ['cloudflare-workers', 'cloudflare-d1'],
  approach: 'Keep the site deployable as static files, with a Cloudflare Worker and D1 database for anonymous hearts.',
  feature: 'Anonymous hearts saved through Cloudflare Workers and D1, with local development and live-site configuration',
  tag: 'CLOUDFLARE / DEPLOYMENT',
  description: 'Visitors can leave a heart without an account. A browser identifier and a Cloudflare Worker API maintain the shared count in D1, while GitHub Actions builds and publishes the static portfolio to GitHub Pages.',
  technologyNotes: [
    { technology: 'cloudflare-workers', role: 'A small HTTP API for anonymous heart reads and explicit, idempotent heart updates.' },
    { technology: 'cloudflare-d1', role: 'Persistent anonymous heart records and the shared total, separate from the static frontend.' },
  ],
} : {
  tools: ['supabase'],
  approach: 'Keep the site deployable as static files, with a small Supabase integration for anonymous hearts.',
  feature: 'Anonymous hearts saved through Supabase, with local development and live-site configuration',
  tag: 'SUPABASE / DEPLOYMENT',
  description: 'Visitors can leave a heart without an account. A browser identifier and Supabase RPC calls maintain the shared count, while GitHub Actions builds and publishes the static portfolio to GitHub Pages.',
  technologyNotes: [
    { technology: 'supabase', role: 'Anonymous heart state and shared counts through a small REST client.' },
  ],
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
    description: 'A gamified Christian life tracker, bringing faith and everyday goals together.',
    status: 'Personal project', accent: 'amber', artwork: 'images/slide02.png',
    screenshot: '', liveUrl: '', sourceUrl: '',
    details: '',
    technologies: ['react', 'vite', 'tailwind', 'shadcn', 'framer-motion', 'supabase', 'react-query'],
    caseStudy: { role: '', focus: 'Gamified productivity', scope: 'Web application', challenge: '', approach: '', features: ['Goals and personal progress', 'Friends and shared encouragement', 'A faith-centered daily experience'], outcome: '', screens: [] },
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
    technologies: ['react', 'vite', 'javascript', 'html', 'css', 'gsap', 'motion', 'swiper', 'three', ...portfolioHeartBackend.tools, 'github-pages', 'github-actions'],
    caseStudy: {
      role: 'Development & interface design', focus: 'Creative portfolio & interaction design', scope: 'React frontend & static deployment',
      challenge: 'Present development, design, and NetSuite experience in one clear professional identity. Make the work easy to explore while giving the portfolio enough character to demonstrate the same care put into its projects.',
      approach: 'Build the experience as focused React components around a shared paper-and-ink visual system. Use Swiper for the hero, GSAP and Motion for coordinated interactions, and Three.js for the identity card. ' + portfolioHeartBackend.approach,
      features: [
        'Three hero slides with terminal typing, rotating words, decryption, and replaying text reveals',
        'A draggable, flippable Three.js identity card with a simulated strap and adaptive colors',
        'Continuous overlapping sections, animated ribbon separators, and a staggered navigation panel',
        'An accordion project gallery with preview transitions, technology explanations, and individual case studies',
        'Shared amber, blue, and coral accents across loaders, controls, backgrounds, and the identity card',
        portfolioHeartBackend.feature,
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
          title: 'A small response that persists', tag: portfolioHeartBackend.tag,
          description: portfolioHeartBackend.description,
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
        ...portfolioHeartBackend.technologyNotes,
        { technology: 'github-pages', role: 'Static hosting for the built portfolio under its repository base path.' },
        { technology: 'github-actions', role: 'Automated production builds and deployment from the main branch.' },
      ],
      deployment: {
        platform: 'GitHub Pages', automation: 'GitHub Actions',
        description: 'The default branch triggers a production build and publishes its static output. The deployed base path and public heart-service configuration are supplied during the build.',
      },
      outcome: 'A live desktop-first portfolio where the interface itself demonstrates the work: development, visual design, motion, and a focused backend integration. Visitors can explore the projects, open the source, view the résumé, and start a professional conversation through LinkedIn.',
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
// END OF FILE: HEARTS-CLOUDFLARE-R5 | data.js
