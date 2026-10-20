// CHANGE VERSION: PORTFOLIO-REFINE-R3 | A quiet moving wall behind the About content
import { asset } from '../utils/assets';
import GridMotion from './GridMotion';
import '../styles/AboutGridBackdrop.css';

const tiles = [
  <span className="about-grid-backdrop__code" key="code"><i>&lt;</i><b>/</b><i>&gt;</i></span>,
  { src: asset('images/slide01.png'), alt: '' },
  <span className="about-grid-backdrop__spark" key="spark">✳</span>,
  <span className="about-grid-backdrop__lines" key="lines"><i /><i /><i /><i /></span>,
  { src: asset('images/slide02.png'), alt: '' },
  <span className="about-grid-backdrop__braces" key="braces">{'{ }'}</span>,
  <span className="about-grid-backdrop__dots" key="dots" />,
  <span className="about-grid-backdrop__orbit" key="orbit"><i /></span>,
];

export default function AboutGridBackdrop() {
  return <div className="about-grid-backdrop" aria-hidden="true" inert>
    <GridMotion items={tiles} rows={3} aspectRatio={1.55} gap={18} radius={14}
      angle={-11} speed={14} direction="alternate" parallax={0.16} spotlight={0.28}
      dim={0.48} fade={0.36} tileColor="color-mix(in srgb, var(--brand-accent, var(--amber)) 15%, #20222a)"
      textColor="#f2e9d6" style={{ '--gm-border': 'color-mix(in srgb, var(--brand-accent, var(--amber)) 35%, transparent)' }} />
  </div>;
}
// END OF FILE: PORTFOLIO-REFINE-R3 | AboutGridBackdrop.jsx
