// CHANGE VERSION: HEARTS-UI-ONLY-R6 | Temporary appreciation without saved counts
import { useState } from 'react';
import PulseHeart from './PulseHeart';
import '../styles/header-hearts.css';

export default function HeaderHearts() {
  // This visit's animation stays in React. Refreshing starts it over;
  // no database, browser identifier, or persistent storage is used.
  const [liked, setLiked] = useState(false);

  return <div className="header-hearts" data-state="ready" data-thanked={liked} data-error={false} data-retry={false} data-copy={liked ? 'thanks' : 'invite'}>
    <span className="header-hearts__copy" aria-hidden="true">
      <span className="header-hearts__copy-layer" data-copy="invite"><span className="header-hearts__prompt">Loved what you see?</span><span className="header-hearts__invitation">Give this page a heart!</span><span className="header-hearts__compact">Give a heart</span></span>
      <span className="header-hearts__copy-layer" data-copy="thanks"><span className="header-hearts__prompt">Thanks!</span><span className="header-hearts__invitation">Appreciate the feedback.</span><span className="header-hearts__compact">Thanks!</span></span>
    </span>
    <PulseHeart liked={liked} count={liked ? 1 : 0} showCount={false}
      onChange={setLiked} size={19} corner={8}
      duration={680} dotSize={0.58} overshoot={0.7} beat={0.6} rollDuration={440}
      likedColor="var(--coral, #d98d83)" idleColor="var(--muted, #aaa8a7)"
      pillColor="transparent" textColor="var(--muted, #aaa8a7)"
      label={liked ? 'Thanks! Remove your heart' : 'Loved what you see? Give this page a heart!'} />
    <span className="header-hearts__status" role="status" aria-live="polite">{liked ? 'Thanks!' : 'Loved what you see? Give this page a heart!'}</span>
  </div>;
}
// END OF FILE: HEARTS-UI-ONLY-R6 | HeaderHearts.jsx
