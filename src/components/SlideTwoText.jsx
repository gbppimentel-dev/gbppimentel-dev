// Two unbroken rows recenter smoothly as natural-width words roll through.
import { useEffect, useLayoutEffect, useRef } from 'react';
import { LayoutGroup, motion } from 'motion/react';
import { useSwiperSlide } from 'swiper/react';
import RotatingText from './RotatingText';
import useAnimationActivity from '../hooks/useAnimationActivity';

const designWords = ['graphic', 'game', 'workflow'];
const developmentWords = ['web', 'systems', 'script'];
const spring = { type: 'spring', damping: 30, stiffness: 400 };
const motionProps = { auto: false, stableWidth: false, animatePresenceMode: 'popLayout', staggerFrom: 'last', staggerDuration: .025,
  initial: { y: '105%', opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: '-115%', opacity: 0 },
  transition: spring, splitBy: 'characters', splitLevelClassName: 'hero-rotating-window' };
const PROBE_FONT = 64;

// Match every variant's real font, padding, border and code cursor. These inert
// copies contain neither motion components nor clocks, and never become visible.
function WordSample({ text, tone, index, className = '' }) {
  return <span className={`text-rotate ${tone} ${className}`} data-word-index={index} aria-hidden="true" inert>
    <span className="text-rotate-content" data-word-index={index}>
      <span className="text-rotate-word hero-rotating-window">
        {Array.from(text).map((character, letter) => <span className="text-rotate-element" key={letter}>{character}</span>)}
      </span>
    </span>
  </span>;
}

export default function SlideTwoText({ reduced = false }) {
  const design = useRef(null), development = useRef(null), root = useRef(null);
  const active = useSwiperSlide()?.isActive ?? false;
  const activity = useAnimationActivity(root, { enabled: active });

  useLayoutEffect(() => {
    const node = root.current;
    if (!node) return undefined;
    let frame = 0, disposed = false, previousWidth = -1;
    const fit = () => {
      frame = 0;
      if (disposed) return;
      const styles = getComputedStyle(node);
      const available = node.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
      if (available <= 0) return;
      const samples = Array.from(node.querySelectorAll('.hero-fit-probe'), probe => ({ row: probe.dataset.fitRow, box: probe.getBoundingClientRect() }));
      const widest = Math.max(1, ...samples.map(sample => sample.box.width));
      const tallest = Math.max(1, ...samples.map(sample => sample.box.height));
      const widthsByRow = new Map();
      samples.forEach(({ row, box }) => {
        if (!widthsByRow.has(row)) widthsByRow.set(row, []);
        widthsByRow.get(row).push(box.width);
      });
      // A long incoming row can briefly retain the previous short row's
      // centered left edge before layout projection catches up. Reserve that
      // worst transition inside the whole body without fixing the word widths.
      const transitionSpan = Math.max(1, ...Array.from(widthsByRow.values(), widths => 2 * Math.max(...widths) - Math.min(...widths)));
      const targetSize = (available - 12) * PROBE_FONT / widest;
      const transitionSize = (node.clientWidth - 12) * PROBE_FONT / transitionSpan;
      const size = Math.max(1, Math.min(80, targetSize, transitionSize));
      node.style.setProperty('--hero-line-size', `${Math.floor(size * 100) / 100}px`);
      node.style.setProperty('--hero-row-height', `${Math.ceil(tallest * size / PROBE_FONT + 4)}px`);
    };
    const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(fit); };
    fit();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(entries => {
      const width = entries[0]?.contentRect.width;
      if (width === previousWidth) return;
      previousWidth = width;
      schedule();
    });
    observer?.observe(node);
    window.addEventListener('resize', schedule, { passive: true });
    document.fonts?.ready.then(schedule).catch(() => {});
    document.fonts?.addEventListener?.('loadingdone', schedule);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', schedule);
      document.fonts?.removeEventListener?.('loadingdone', schedule);
    };
  }, []);

  useEffect(() => { if (!active) { design.current?.reset(); development.current?.reset(); } }, [active]);
  useEffect(() => {
    if (!activity.active || reduced) return;
    const id = setInterval(() => { design.current?.next(); development.current?.next(); }, 1800);
    return () => clearInterval(id);
  }, [activity.active, reduced]);

  const configurations = [
    { prefix: '/$', ref: design, texts: designWords, tone: 'hero-rotate-design', suffix: 'design &' },
    { prefix: '.', ref: development, texts: developmentWords, tone: 'hero-rotate-development', suffix: 'development>' },
  ];
  const words = ({ ref, texts, tone }) => <motion.span className="hero-word-run" layout={reduced ? false : 'position'} transition={spring}>
    {reduced ? <>
      <span className="text-rotate-sr-only">{texts.join(', ')}</span>
      <WordSample text={texts[0]} tone={tone} index={0} className="hero-word-static" />
    </> : <RotatingText ref={ref} texts={texts} {...motionProps} mainClassName={tone} />}
  </motion.span>;
  // Animate the centered row's width and position together; position-only FLIP
  // would expose a long target row at the previous short row's left edge.
  const line = configuration => <motion.span className="hero-rotating-row" layout={!reduced} transition={spring}>
    <motion.span className="hero-rotating-prefix" layout={reduced ? false : 'position'} transition={spring}>{configuration.prefix}</motion.span>
    {words(configuration)}
    <motion.span className="hero-static-phrase" layout={reduced ? false : 'position'} transition={spring}>{configuration.suffix}</motion.span>
  </motion.span>;

  return <div ref={root} className="hero-workbench-body hero-two-lines">
    <div className="hero-fit-probes" aria-hidden="true" inert>
      {configurations.flatMap(configuration => configuration.texts.map((text, index) => <span className="hero-fit-probe" data-fit-row={configuration.tone} key={`${configuration.tone}-${text}`}>
        <span className="hero-rotating-prefix">{configuration.prefix}</span>
        <WordSample text={text} tone={configuration.tone} index={index} />
        <span className="hero-static-phrase">{configuration.suffix}</span>
      </span>))}
    </div>
    <LayoutGroup>
      <p className="hero-design-line hero-rotating-line" data-swiper-parallax="-200">{line(configurations[0])}</p>
      <h2 className="hero-rotating-line" data-swiper-parallax="-300">{line(configurations[1])}</h2>
    </LayoutGroup>
  </div>;
}
