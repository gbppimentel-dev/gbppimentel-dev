// CHANGE VERSION: NETSUITE-PROJECTS-R1 | 2026-10-20 | Complete data.js
export const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/glenn-bernard-pimentel-2b3461265/",
  },
  { name: "GitHub", href: "https://github.com/gbppimentel-dev" },
];

// Add real screenshots under public/images/projects, then set screenshot below.
// URLs stay empty until you provide the real destination. No fake links are shown.
export const projects = [
  {
    id: 'salt-and-light', title: 'Salt & Light', category: 'Web development',
    description: 'A gamified Christian life tracker, bringing faith and everyday goals together.',
    status: 'Case study coming soon', accent: 'amber', artwork: 'images/slide02.png',
    screenshot: '', liveUrl: '', sourceUrl: '',
    details: '',
    technologies: ['react', 'vite', 'tailwind', 'shadcn', 'framer-motion', 'supabase', 'react-query'],
  },
  {
    id: 'lifecity-attendance', title: 'LifeCity Attendance', category: 'Web development',
    description: 'A church attendance application built for the LifeCity community.',
    status: 'Case study coming soon', accent: 'blue', artwork: 'images/slide01.png',
    screenshot: '', liveUrl: '', sourceUrl: '',
    details: '',
    // Add verified technology IDs here when this project's stack is ready to share.
    technologies: [],
  },
  {
    id: 'gbppimentel-dev', title: 'gbppimentel-dev', category: 'Web development',
    description: 'A playful professional portfolio connecting development, design, and ERP solutions.',
    status: 'You are exploring it', accent: 'coral', artwork: 'images/slide03.png',
    screenshot: '', liveUrl: '#home', liveLabel: 'Explore portfolio', sourceUrl: '',
    details: 'An interactive React portfolio with an animated hero carousel, draggable lanyard ID, adaptive colors, and a gallery of selected work.',
    technologies: ['react', 'vite', 'javascript', 'html', 'css', 'gsap', 'motion', 'swiper', 'three'],
  },
];

export const contact = {
  title: 'LET’S CREATE SOMETHING.',
  description: 'Have an idea, a project, or an opportunity in mind? Let’s talk.',
  email: '', // Your public contact email; leave empty to use LinkedIn instead.
  linkedin: 'https://www.linkedin.com/in/glenn-bernard-pimentel-2b3461265/',
};
// END OF FILE: NETSUITE-PROJECTS-R1 | data.js
