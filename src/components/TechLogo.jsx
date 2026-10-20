// CHANGE VERSION: NETSUITE-PROJECTS-R1 | 2026-10-20 | Complete TechLogo.jsx

// Lightweight, code-drawn technology emblems. Labels keep every tool identifiable.
// Add an entry here and its ID to a project's technologies array in data.js.
export const technologyCatalog = {
  react: { label: 'React', color: '#78d7ed', glyph: 'react' },
  vite: { label: 'Vite', color: '#c5a3ff', glyph: 'vite' },
  javascript: { label: 'JavaScript', color: '#f2d66f', glyph: 'javascript' },
  html: { label: 'HTML', color: '#f2a28b', glyph: 'html' },
  css: { label: 'CSS', color: '#a8c9f0', glyph: 'css' },
  gsap: { label: 'GSAP', color: '#c1eaa0', glyph: 'gsap' },
  motion: { label: 'Motion', color: '#f1d16d', glyph: 'motion' },
  'framer-motion': { label: 'Framer Motion', color: '#f1d16d', glyph: 'motion' },
  swiper: { label: 'Swiper', color: '#a8c9f0', glyph: 'swiper' },
  three: { label: 'Three.js', color: '#f2e9d6', glyph: 'three' },
  tailwind: { label: 'Tailwind CSS', color: '#8ed8e4', glyph: 'tailwind' },
  shadcn: { label: 'shadcn/ui', color: '#f2e9d6', glyph: 'shadcn' },
  supabase: { label: 'Supabase', color: '#9be3b7', glyph: 'supabase' },
  'react-query': { label: 'React Query', color: '#efaa9b', glyph: 'query' },
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
    default: return <><path d="m11 8-8 8 8 8m10-16 8 8-8 8m-3-19-4 22" /></>;
  }
}

export default function TechLogo({ technology, className = '' }) {
  const entry = technologyCatalog[technology];
  return <svg className={`project-tech-emblem ${className}`.trim()} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <Emblem glyph={entry?.glyph} />
  </svg>;
}
// END OF FILE: NETSUITE-PROJECTS-R1 | TechLogo.jsx
