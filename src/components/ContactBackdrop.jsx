// CHANGE VERSION: PORTFOLIO-CONTACT-R7 | The supplied FloatingLines is the Contact background
import FloatingLines from './FloatingLines';

export default function ContactBackdrop() {
  return <div className="contact-lines-backdrop" aria-hidden="true" inert>
    <FloatingLines adaptiveColor backgroundColor="#14151b" mixBlendMode="normal"
      enabledWaves={['top', 'middle', 'bottom']} lineCount={10} lineDistance={6}
      lineWidth={1.35} glow={.5} brightness={1.1} opacity={1}
      animationSpeed={.85} amplitude={1.2} depthOfField={.25} edgeFade={.08}
      interactive bendRadius={5} bendStrength={-.5} parallax parallaxStrength={.2}
      clickSwirl dpr={1.5} />
  </div>;
}
// END OF FILE: PORTFOLIO-CONTACT-R7 | ContactBackdrop.jsx
