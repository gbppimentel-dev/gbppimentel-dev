// CHANGE VERSION: PORTFOLIO-POLISH-R1 | 2026-10-14 | Complete MorphNumber.jsx
import { useState } from 'react';
import '../styles/PortfolioDetails.css';

export default function MorphNumber({ value, padded = false }) {
  const text = padded ? String(value).padStart(2, '0') : String(value);
  const [frame, setFrame] = useState({ current: text, previous: null, id: 0 });
  // A changed digit gets one outgoing and one incoming shape, including rapid changes.
  if (frame.current !== text) setFrame({ current: text, previous: frame.current, id: frame.id + 1 });
  const finish = () => setFrame(latest => latest.id === frame.id && latest.previous !== null ? { ...latest, previous: null } : latest);
  return <span className="morph-number">
    <span className="number-accessible">{text}</span>
    <span className="number-size" aria-hidden="true">{text}</span>
    {frame.previous !== null && <span key={`out-${frame.id}`} className="number-shape number-out" aria-hidden="true">{frame.previous}</span>}
    <span key={`in-${frame.id}`} className={`number-shape ${frame.previous !== null ? 'number-in' : ''}`} aria-hidden="true" onAnimationEnd={finish}>{frame.current}</span>
  </span>;
}
// END OF FILE: PORTFOLIO-POLISH-R1 | MorphNumber.jsx
