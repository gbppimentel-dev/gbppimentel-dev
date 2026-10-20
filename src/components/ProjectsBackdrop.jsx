// CHANGE VERSION: PORTFOLIO-REFINE-R4 | Local drifting artwork behind the project collection
import GridMotion from './GridMotion';
import { asset } from '../utils/assets';

const tiles = [
  { src: asset('images/slide01.png'), alt: '' },
  <span key="braces" className="projects-backdrop__glyph">{'{ }'}</span>,
  { src: asset('images/slide03.png'), alt: '' },
  <span key="spark" className="projects-backdrop__spark">✳</span>,
  <span key="code" className="projects-backdrop__glyph">&lt;/&gt;</span>,
  { src: asset('images/slide02.png'), alt: '' },
  <span key="dots" className="projects-backdrop__dots" />,
];

export default function ProjectsBackdrop() {
  return <div className="projects-backdrop" aria-hidden="true" inert>
    <div className="projects-backdrop__art" style={{ backgroundImage: 'url(' + asset('images/slide03.png') + ')' }} />
    <GridMotion items={tiles} rows={4} aspectRatio={1.55} gap={20} radius={16}
      angle={-10} speed={12} direction="alternate" parallax={.12} spotlight={.22}
      dim={.5} fade={.32} tileColor="color-mix(in srgb, var(--brand-accent, var(--amber)) 13%, #252a35)"
      textColor="#f2e9d6" />
  </div>;
}
// END OF FILE: PORTFOLIO-REFINE-R4 | ProjectsBackdrop.jsx
