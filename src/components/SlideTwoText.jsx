// CHANGE VERSION: PORTFOLIO-POLISH-R6 | 2026-10-14 | Complete SlideTwoText.jsx
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
  return <LayoutGroup>
    <p className="hero-design-line hero-rotating-line" data-swiper-parallax="-200">{row('/$', design, designWords, 'hero-rotate-design', 'design &')}</p>
    <h2 className="hero-rotating-line" data-swiper-parallax="-300">{row('.', development, developmentWords, 'hero-rotate-development', 'development>')}</h2>
    <div className="slide-two-actions">
      <a href="#about" className="hero-resume hero-about" aria-label="About Glenn Bernard Pimentel"><span className="hero-resume-face hero-resume-rest" aria-hidden="true"><svg className="hero-resume-icon" viewBox="0 0 20 20" focusable="false"><circle cx="10" cy="6" r="3" /><path d="M3.5 17a6.5 6.5 0 0 1 13 0" /></svg><span className="hero-resume-label">ABOUT ME</span></span><span className="hero-resume-face hero-resume-hover" aria-hidden="true"><svg className="hero-resume-icon hero-layers-icon" viewBox="0 0 20 20" focusable="false"><path d="M7 2.75h7.2L17 5.6v10.65a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3.75a1 1 0 0 1 1-1Z" /><path d="M14 2.9v3h2.8M4 6.5v10.75a1 1 0 0 0 1 1h8.5M2 9v9.25a1 1 0 0 0 1 1h8.5M9 9h4M9 12h4" /></svg><span className="hero-resume-label">BEHIND THE WORK</span></span></a>
    </div>
  </LayoutGroup>;
}
// END OF FILE: PORTFOLIO-POLISH-R6 | SlideTwoText.jsx
