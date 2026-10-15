// CHANGE VERSION: HERO-BLUR-BYLINE-R1 | Replays the word reveal on each slide 3 visit
import { motion } from 'motion/react';

export default function BlurText({ text = '', active = false, className = '' }) {
  const words = text.split(' ');
  return (
    <p className={className} data-swiper-parallax="-140" aria-label={text}>
      <span className="hero-three-byline-mark" aria-hidden="true">//</span>
      <span className="hero-three-byline-copy" aria-hidden="true">
        {words.map((word, index) => (
          <motion.span
            className={word === '→' ? 'hero-three-byline-route' : 'hero-three-byline-word'}
            key={`${word}-${index}`}
            initial={{ filter: 'blur(9px)', opacity: 0, y: 9 }}
            animate={active ? { filter: 'blur(0px)', opacity: 1, y: 0 } : { filter: 'blur(9px)', opacity: 0, y: 9 }}
            transition={{ duration: 0.72, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
          >{word}</motion.span>
        ))}
      </span>
    </p>
  );
}
// END OF FILE: HERO-BLUR-BYLINE-R1 | BlurText.jsx
