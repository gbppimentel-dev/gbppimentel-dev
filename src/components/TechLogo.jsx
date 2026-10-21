// CHANGE VERSION: PORTFOLIO-SALT-LIGHT-R1 | Verified Salt & Light technology emblems

// Lightweight, code-drawn technology emblems. Labels keep every tool identifiable.
// Add an entry here and its ID to a project's technologies array in data.js.
export const technologyCatalog = {
  react: { label: 'React', color: '#78d7ed', glyph: 'react', description: 'Builds interactive website interfaces from reusable pieces that update as people use them.' },
  vite: { label: 'Vite', color: '#c5a3ff', glyph: 'vite', description: 'Runs a fast local development server and bundles website files for publishing.' },
  javascript: { label: 'JavaScript', color: '#f2d66f', glyph: 'javascript', description: 'Adds interactive behavior to websites, from buttons and forms to live updates.' },
  html: { label: 'HTML', color: '#f2a28b', glyph: 'html', description: 'Defines the structure and meaning of website content, including headings, links, and forms.' },
  css: { label: 'CSS', color: '#a8c9f0', glyph: 'css', description: 'Controls how websites look, including colors, typography, spacing, and layouts across screen sizes.' },
  gsap: { label: 'GSAP', color: '#c1eaa0', glyph: 'gsap', description: 'Creates smooth animations with precise control over timing, movement, and coordinated sequences.' },
  motion: { label: 'Motion', color: '#f1d16d', glyph: 'motion', description: 'Animates website elements with smooth movement, responsive gestures, and transitions between layouts.' },
  'framer-motion': { label: 'Framer Motion', color: '#f1d16d', glyph: 'motion', description: 'Adds smooth animations, gesture interactions, and automatic layout transitions to React interfaces.' },
  swiper: { label: 'Swiper', color: '#a8c9f0', glyph: 'swiper', description: 'Creates touch-friendly sliders and carousels for browsing images, cards, and other content.' },
  three: { label: 'Three.js', color: '#f2e9d6', glyph: 'three', description: 'Creates interactive three-dimensional graphics and scenes that run directly in a web browser.' },
  tailwind: { label: 'Tailwind CSS', color: '#8ed8e4', glyph: 'tailwind', description: 'Styles website interfaces using small, reusable classes for layout, colors, spacing, and typography.' },
  shadcn: { label: 'shadcn/ui', color: '#f2e9d6', glyph: 'shadcn', description: 'Provides customizable interface components, including buttons, dialogs, and menus, for building consistent websites.' },
  supabase: { label: 'Supabase', color: '#9be3b7', glyph: 'supabase', description: 'Provides hosted databases, user accounts, and tools for storing files and building applications.' },
  'react-query': { label: 'React Query', color: '#efaa9b', glyph: 'query', description: 'Fetches, caches, and refreshes server data to keep React interfaces up to date.' },
  typescript: { label: 'TypeScript', color: '#a8c9f0', glyph: 'typescript', description: 'Adds type checks to JavaScript, helping developers catch mistakes before running their code.' },
  postgresql: { label: 'PostgreSQL', color: '#a8c9f0', glyph: 'postgresql', description: 'Stores and organizes application data in a relational database with powerful querying tools.' },
  'html5-qrcode': { label: 'html5-qrcode', color: '#9be3b7', glyph: 'qr-scanner', description: 'Scans QR codes and barcodes using a device camera or an uploaded image.' },
  'qrcode-react': { label: 'qrcode.react', color: '#78d7ed', glyph: 'qr-code', description: 'Generates QR codes inside React interfaces so people can quickly open encoded information.' },
  papaparse: { label: 'Papa Parse', color: '#f2d66f', glyph: 'csv', description: 'Reads and creates CSV files, making spreadsheet-style data easier to use in websites.' },
  lucide: { label: 'Lucide React', color: '#efaa9b', glyph: 'lucide', description: 'Provides a consistent collection of customizable icons for buttons, navigation, and interface details.' },
  vercel: { label: 'Vercel', color: '#f2e9d6', glyph: 'vercel', description: 'Publishes web applications online and automatically deploys updates connected to a code repository.' },
  'github-pages': { label: 'GitHub Pages', color: '#b6cce5', glyph: 'pages', description: 'Hosts the built portfolio as a static website from its GitHub repository.' },
  'github-actions': { label: 'GitHub Actions', color: '#edc879', glyph: 'actions', description: 'Runs automated build and deployment workflows when project updates reach the main branch.' },
  'cloudflare-workers': { label: 'Cloudflare Workers', color: '#efbd88', glyph: 'cloudflare-workers', description: 'Runs backend code for website APIs, handling requests without a dedicated application server.' },
  'cloudflare-d1': { label: 'Cloudflare D1', color: '#a8c9f0', glyph: 'cloudflare-d1', description: 'Stores application data in a serverless SQL database that Cloudflare Workers can query.' },
  'react-router': { label: 'React Router', color: '#f1a5a5', glyph: 'router', description: 'Handles navigation between application pages and routes that require a signed-in user.' },
  'date-fns': { label: 'date-fns', color: '#efbddf', glyph: 'date', description: 'Formats dates and helps build calendars, due dates, and comparisons between days.' },
  html2canvas: { label: 'html2canvas', color: '#a9dfcc', glyph: 'canvas', description: 'Renders a visible interface into an image for downloadable profile cards and journal views.' },
  pwa: { label: 'PWA', color: '#cbb8f4', glyph: 'pwa', description: 'Adds an installable web-app experience through a manifest, service worker, and standalone display settings.' },
  capacitor: { label: 'Capacitor', color: '#91c5ef', glyph: 'capacitor', description: 'Packages a web application inside native Android and iOS project targets.' },
  'api-bible': { label: 'API.Bible', color: '#f2d287', glyph: 'bible', description: 'Provides Bible translations and passage content for an application to display.' },
};

function Emblem({ glyph }) {
  switch (glyph) {
    case 'react': return <><ellipse cx="16" cy="16" rx="14" ry="5.5" /><ellipse cx="16" cy="16" rx="14" ry="5.5" transform="rotate(60 16 16)" /><ellipse cx="16" cy="16" rx="14" ry="5.5" transform="rotate(120 16 16)" /><circle cx="16" cy="16" r="2.3" fill="currentColor" stroke="none" /></>;
    case 'vite': return <><path d="m3 6 13 23L29 6l-9 2-4 12-3-12Z" /><path d="m18 2-7 13h6l-2 12L25 11h-7l4-9Z" fill="currentColor" stroke="none" /></>;
    case 'javascript': return <><rect x="3" y="3" width="26" height="26" rx="4" /><text x="7" y="23" fill="currentColor" stroke="none" fontSize="15" fontFamily="Arial, sans-serif" fontWeight="700">JS</text></>;
    case 'html': return <><path d="m5 3 2 23 9 3 9-3 2-23Z" /><path d="M11 10h11l-.5 5H12l.4 5 3.6 1 3.6-1 .3-3" /></>;
    case 'css': return <><path d="m5 3 2 23 9 3 9-3 2-23Z" /><path d="M10 10h12l-.5 5H13m8 0-.6 5-4.4 1.5-4.4-1.5" /></>;
    case 'gsap': return <><path d="M28 10a12 12 0 1 0-1 14V15H17m1 7h9M2 5h9M2 10h5" /><path d="m17 3-3 8h6l-3 7" /></>;
    case 'motion': return <><path d="m3 24 9-16h6L9 24Zm11 0 9-16h6l-9 16Z" fill="currentColor" stroke="none" /><circle cx="28" cy="23" r="2" fill="currentColor" stroke="none" /></>;
    case 'swiper': return <><rect x="3" y="5" width="26" height="22" rx="5" /><path d="m11 11-5 5 5 5m10-10 5 5-5 5M14 16h4" /><circle cx="14" cy="24" r=".7" fill="currentColor" /><circle cx="18" cy="24" r=".7" fill="currentColor" /></>;
    case 'three': return <><path d="m4 3 24 9L13 29Zm0 0 9 26 4-20Zm13 6 11 3-15 17m-5-17 15 8m-13 1 11-9" /></>;
    case 'tailwind': return <><path d="M2 15c4-8 9-9 15-4 4 3 8 2 13-4-3 8-9 10-15 5-5-4-9-2-13 3Zm0 11c4-8 9-9 15-4 4 3 8 2 13-4-3 8-9 10-15 5-5-4-9-2-13 3Z" fill="currentColor" stroke="none" /></>;
    case 'shadcn': return <><path d="M7 25 25 7M18 25l7-7" strokeWidth="3" /></>;
    case 'supabase': return <><path d="M18 2 4 19h11l-1 11 14-17H17Z" fill="currentColor" stroke="none" /></>;
    case 'query': return <><ellipse cx="16" cy="16" rx="6" ry="13" transform="rotate(0 16 16)" /><ellipse cx="16" cy="16" rx="6" ry="13" transform="rotate(60 16 16)" /><ellipse cx="16" cy="16" rx="6" ry="13" transform="rotate(120 16 16)" /><circle cx="16" cy="16" r="3" fill="currentColor" /></>;
    case 'typescript': return <><rect x="3" y="3" width="26" height="26" rx="4" /><text x="6" y="23" fill="currentColor" stroke="none" fontSize="15" fontFamily="Arial, sans-serif" fontWeight="700">TS</text></>;
    case 'postgresql': return <><ellipse cx="16" cy="7" rx="11" ry="4" /><path d="M5 7v17c0 2.2 4.9 4 11 4s11-1.8 11-4V7M5 15c0 2.2 4.9 4 11 4s11-1.8 11-4" /><path d="M10 13v3m6-2v3m6-4v3" /></>;
    case 'qr-scanner': return <><path d="M10 3H3v7m19-7h7v7M3 22v7h7m19-7v7h-7M2 16h28" /><path d="M8 8h5v5H8Zm11 0h5v5h-5ZM8 19h5v5H8Zm11 0h2v2h3v3h-5Z" /></>;
    case 'qr-code': return <><rect x="3" y="3" width="10" height="10" rx="1" /><rect x="19" y="3" width="10" height="10" rx="1" /><rect x="3" y="19" width="10" height="10" rx="1" /><path d="M19 19h4v4h6v6h-6m-4-6v6m10-10h-2" /><path d="M7 7h2v2H7Zm16 0h2v2h-2ZM7 23h2v2H7Z" fill="currentColor" stroke="none" /></>;
    case 'csv': return <><path d="M18 3H5v26h22V12l-9-9Zm0 0v9h9M9 17h14M9 22h14M14 15v11m5-11v11" /></>;
    case 'lucide': return <><circle cx="16" cy="16" r="8" /><path d="M16 2v3m0 22v3M2 16h3m22 0h3M6 6l2 2m16 16 2 2M6 26l2-2M24 8l2-2" /></>;
    case 'vercel': return <path d="m16 4 14 24H2Z" fill="currentColor" stroke="none" />;
    case 'pages': return <><rect x="4" y="3" width="24" height="26" rx="3" /><path d="M4 10h24M9 6.5h.1m3 0h.1M10 16l-4 4 4 4m12-8 4 4-4 4m-4-10-4 12" /></>;
    case 'actions': return <><circle cx="8" cy="7" r="4" /><circle cx="8" cy="25" r="4" /><path d="M8 11v10m4-14h9a5 5 0 0 1 5 5v3" /><rect x="18" y="15" width="12" height="14" rx="3" /><path d="m22 19 5 3-5 3Z" fill="currentColor" stroke="none" /></>;
    case 'cloudflare-workers': return <><path d="M10 24H8a6 6 0 0 1-.8-11.9A9 9 0 0 1 24.8 10a7 7 0 0 1-.8 14h-2" /><path d="m18 10-7 11h6l-2 9 10-14h-7Z" fill="currentColor" stroke="none" /></>;
    case 'cloudflare-d1': return <><ellipse cx="16" cy="7" rx="12" ry="4" /><path d="M4 7v18c0 2.2 5.4 4 12 4s12-1.8 12-4V7M4 13c0 2.2 5.4 4 12 4s12-1.8 12-4" /><text x="9" y="25" fill="currentColor" stroke="none" fontSize="10" fontFamily="Arial, sans-serif" fontWeight="700">D1</text></>;
    case 'router': return <><circle cx="6" cy="7" r="3" /><circle cx="26" cy="25" r="3" /><circle cx="6" cy="25" r="3" /><path d="M9 7h7a5 5 0 0 1 5 5v8m-12 5h7a5 5 0 0 0 5-5V12M6 10v12" /></>;
    case 'date': return <><rect x="4" y="6" width="24" height="23" rx="4" /><path d="M10 3v6m12-6v6M4 13h24m-17 5h4m-4 5h4m6-5h2m-2 5h2" /></>;
    case 'canvas': return <><rect x="3" y="4" width="26" height="20" rx="3" /><path d="M11 29h10m-5-5v5M8 9h5v5H8Zm10 5 8 4-4 1-1 4Z" /><path d="M17 9h7" /></>;
    case 'pwa': return <><rect x="3" y="5" width="21" height="21" rx="3" /><path d="M3 11h21m-15-3h.1m3 0h.1" /><rect x="18" y="14" width="11" height="16" rx="2" /><path d="m21 21 2 2 3-4m-3 8h1" /></>;
    case 'capacitor': return <><path d="m9 3 20 20-6 6L3 9Zm14 0 6 6L9 29l-6-6Z" /><path d="m12 6 14 14M6 12l14 14" /></>;
    case 'bible': return <><path d="M4 6c5-3 9-2 12 1 3-3 7-4 12-1v22c-5-3-9-2-12 1-3-3-7-4-12-1Z" /><path d="M16 7v22M9 10v9m-3-6h6m8-2h4m-4 5h4m-4 5h4" /></>;
    default: return <><path d="m11 8-8 8 8 8m10-16 8 8-8 8m-3-19-4 22" /></>;
  }
}

export default function TechLogo({ technology, className = '' }) {
  const entry = technologyCatalog[technology];
  return <svg className={`project-tech-emblem ${className}`.trim()} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <Emblem glyph={entry?.glyph} />
  </svg>;
}
// END OF FILE: PORTFOLIO-SALT-LIGHT-R1 | TechLogo.jsx
