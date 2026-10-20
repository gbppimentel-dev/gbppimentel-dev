// CHANGE VERSION: PORTFOLIO-REFINE-R4 | Project case-study fields and verified content
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
    description: 'A church attendance application built for the LifeCity community.',
    status: 'Web application', accent: 'blue', artwork: 'images/slide01.png',
    screenshot: '', liveUrl: '', sourceUrl: '',
    details: '',
    // Add verified technology IDs here when this project's stack is ready to share.
    technologies: [],
    caseStudy: { role: '', focus: 'Attendance management', scope: 'Web application', challenge: '', approach: '', features: [], outcome: '', screens: [] },
  },
  {
    id: 'gbppimentel-dev', title: 'gbppimentel-dev', category: 'Web development',
    description: 'A playful professional portfolio connecting development, design, and ERP solutions.',
    status: 'You are exploring it', accent: 'coral', artwork: 'images/slide03.png',
    screenshot: '', liveUrl: '#home', liveLabel: 'Explore portfolio', sourceUrl: 'https://github.com/gbppimentel-dev/gbppimentel-dev',
    details: 'An interactive React portfolio with an animated hero carousel, draggable lanyard ID, adaptive colors, and a gallery of selected work.',
    technologies: ['react', 'vite', 'javascript', 'html', 'css', 'gsap', 'motion', 'swiper', 'three'],
    caseStudy: {
      role: 'Development & interface design', focus: 'Professional portfolio', scope: 'Design and frontend build',
      challenge: 'Bring development, design, and ERP experience into one coherent portfolio.',
      approach: 'Use React with focused interactive components, shared adaptive colors, and a consistent paper-and-ink interface.',
      features: ['Animated hero carousel and text effects', 'Draggable identity card and adaptive accents', 'Project gallery and connected case studies'],
      outcome: '', screens: [],
    },
  },
];

export const contact = {
  title: 'LET’S CREATE SOMETHING.',
  description: 'Have an idea, a project, or an opportunity in mind? Let’s talk.',
  email: '', // Your public contact email; leave empty to use LinkedIn instead.
  linkedin: 'https://www.linkedin.com/in/glenn-bernard-pimentel-2b3461265/',
};
// END OF FILE: PORTFOLIO-REFINE-R4 | data.js
