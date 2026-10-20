// CHANGE VERSION: HERO-REFINE-R6 | 2026-10-20 | Complete SlideTwoText.jsx
import { useEffect, useRef } from 'react';
import { LayoutGroup, motion } from 'motion/react';
import { useSwiperSlide } from 'swiper/react';
import RotatingText from './RotatingText';
const designWords = ['graphic', 'game', 'workflow'];
const developmentWords = ['web', 'systems', 'script'];
const spring = { type: 'spring', damping: 30, stiffness: 400 };
const motionProps = { auto: false, stableWidth: false, animatePresenceMode: 'popLayout', staggerFrom: 'last', staggerDuration: .025,
  initial: { y: '105%', opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: '-115%', opacity: 0 },
  transition: spring, splitBy: 'characters', splitLevelClassName: 'hero-rotating-window' };

// Every type treatment contributes its real font, border, padding and cursor to
// the panel's intrinsic width. These inert copies share the live row's grid
// cell, reserving its tallest wrapped state when the viewport gets narrower.
// They contain no rotating components, animations, IDs or additional clocks.
const sizingRows = (prefix, texts, tone, suffix) => texts.map((text, index) => (
  <span className="hero-rotating-row hero-rotating-sizing-row" aria-hidden="true" inert key={text}>
    <span className="hero-rotating-group">
      <span className="hero-rotating-prefix">{prefix}</span>
      <span className={`text-rotate ${tone}`} data-word-index={index}>
        <span className="text-rotate-content" data-word-index={index}>
          <span className="text-rotate-word hero-rotating-window">
            {Array.from(text).map((character, letter) => <span className="text-rotate-element" key={letter}>{character}</span>)}
          </span>
        </span>
      </span>
    </span>
    <span className="hero-static-phrase">{suffix}</span>
  </span>
));

export default function SlideTwoText({ reduced = false }) {
  const design = useRef(null), development = useRef(null);
  const active = useSwiperSlide()?.isActive ?? false;
  useEffect(() => { if (!active) { design.current?.reset(); development.current?.reset(); } }, [active]);
  useEffect(() => {
    if (!active || reduced) return;
    // Text has its own clock: the carousel pause control never stops these words.
    const id = setInterval(() => { design.current?.next(); development.current?.next(); }, 1800);
    return () => clearInterval(id);
  }, [active, reduced]);
  const words = (ref, texts, tone) => reduced ? <span className={`hero-rotating-static ${tone}`}>{texts.join(' / ')}</span>
    : <RotatingText ref={ref} texts={texts} {...motionProps} mainClassName={tone} />;
  const row = (prefix, ref, texts, tone, suffix) => <motion.span className="hero-rotating-row" layout={!reduced} transition={spring}>
    <motion.span className="hero-rotating-group" layout={reduced ? false : 'position'} transition={spring}>
      <span className="hero-rotating-prefix">{prefix}</span>{words(ref, texts, tone)}
    </motion.span>
    <motion.span className="hero-static-phrase" layout={reduced ? false : 'position'} transition={spring}>{suffix}</motion.span>
  </motion.span>;
  return <div className="hero-workbench-body"><LayoutGroup>
    <p className="hero-design-line hero-rotating-line" data-swiper-parallax="-200">
      {sizingRows('/$', designWords, 'hero-rotate-design', 'design &')}
      {row('/$', design, designWords, 'hero-rotate-design', 'design &')}
    </p>
    <h2 className="hero-rotating-line" data-swiper-parallax="-300">
      {sizingRows('.', developmentWords, 'hero-rotate-development', 'development>')}
      {row('.', development, developmentWords, 'hero-rotate-development', 'development>')}
    </h2>
    <div className="slide-two-actions">
      <a href="#about" className="hero-resume hero-about" aria-label="About Glenn Bernard Pimentel"><span className="hero-resume-face hero-resume-rest" aria-hidden="true"><svg className="hero-resume-icon" viewBox="0 0 20 20" focusable="false"><circle cx="10" cy="6" r="3" /><path d="M3.5 17a6.5 6.5 0 0 1 13 0" /></svg><span className="hero-resume-label">ABOUT ME</span></span><span className="hero-resume-face hero-resume-hover" aria-hidden="true"><svg className="hero-resume-icon hero-layers-icon" viewBox="0 0 20 20" focusable="false"><path d="M7 2.75h7.2L17 5.6v10.65a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3.75a1 1 0 0 1 1-1Z" /><path d="M14 2.9v3h2.8M4 6.5v10.75a1 1 0 0 0 1 1h8.5M2 9v9.25a1 1 0 0 0 1 1h8.5M9 9h4M9 12h4" /></svg><span className="hero-resume-label">BEHIND THE WORK</span></span></a>
    </div>
  </LayoutGroup></div>;
}
// END OF FILE: HERO-REFINE-R6 | SlideTwoText.jsx
