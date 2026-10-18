/* CHANGE VERSION: ID-COHERENT-HERO-R1 | Measured About card pages without internal scrolling */
import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react';

/* Content moves at whole-block boundaries, so a paragraph or heading is never cropped. */
export function buildDeckPages(pages, heights, availableHeight, gap = 12) {
  return pages.flatMap(page => {
    const chunks = [];
    let blocks = [];
    let height = 0;
    page.blocks.forEach(block => {
      const blockHeight = heights.get(block.id) || 0;
      const nextHeight = height + (blocks.length ? gap : 0) + blockHeight;
      if (blocks.length && nextHeight > availableHeight + 1) {
        chunks.push(blocks);
        blocks = [];
        height = 0;
      }
      height += (blocks.length ? gap : 0) + blockHeight;
      blocks.push(block);
    });
    if (blocks.length) chunks.push(blocks);
    return chunks.map(chunk => ({ ...page, id: `${page.id}-${chunk[0].id}`, blocks: chunk }));
  });
}

function ArrowIcon({ previous = false }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" style={previous ? { transform: 'rotate(180deg)' } : undefined}><path d="M4 12h15M13 5l7 7-7 7" /></svg>;
}

function DeckPage({ current, direction, id, index, reducedMotion, total }) {
  const present = useIsPresent();
  return <motion.div id={id} className="about-deck__page" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${total}: ${current.label}`} aria-hidden={!present} inert={!present}
    custom={direction}
    variants={{ enter: value => ({ opacity: 0, x: reducedMotion ? 0 : value * 18 }), show: { opacity: 1, x: 0 }, leave: value => ({ opacity: 0, x: reducedMotion ? 0 : value * -12 }) }}
    initial="enter" animate="show" exit="leave" transition={{ duration: reducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}>
    <div className="about-deck__blocks">{current.blocks.map(block => <div className="about-deck__block" data-block-id={block.id} key={block.id}>{block.content}</div>)}</div>
  </motion.div>;
}

export default function AboutCardDeck({ id, label, pages, className = '' }) {
  const [deckPages, setDeckPages] = useState(() => buildDeckPages(pages, new Map(), Infinity));
  const [{ index, direction }, setPosition] = useState({ index: 0, direction: 1 });
  const [compact, setCompact] = useState(false);
  const regularChromeRef = useRef(0);
  const viewportRef = useRef(null);
  const measureRef = useRef(null);
  const pagesRef = useRef(deckPages);
  const selectedBlockRef = useRef(deckPages[0]?.blocks[0]?.id);
  const reducedMotion = useReducedMotion();
  const safeIndex = Math.min(index, deckPages.length - 1);
  const current = deckPages[safeIndex];
  pagesRef.current = deckPages;
  selectedBlockRef.current = current?.blocks[0]?.id;
  const pageId = page => `${id}-page-${page.id}`;

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const measureRoot = measureRef.current;
    if (!viewport || !measureRoot) return undefined;
    let frame = 0;
    let alive = true;
    const measure = () => {
      if (!alive) return;
      const available = viewport.clientHeight;
      if (!viewport.clientWidth) return;
      const heights = new Map(Array.from(measureRoot.children, block => [block.dataset.blockId, block.getBoundingClientRect().height]));
      const deck = viewport.closest('.about-deck');
      if (!compact) regularChromeRef.current = deck.clientHeight - available;
      const regularBudget = deck.clientHeight - regularChromeRef.current;
      const tallestBlock = Math.max(0, ...heights.values());
      const needsCompact = tallestBlock > regularBudget + 1;
      if (compact !== needsCompact) { setCompact(needsCompact); return; }
      const gap = parseFloat(getComputedStyle(viewport).getPropertyValue('--about-deck-block-gap')) || 12;
      const next = buildDeckPages(pages, heights, available, gap);
      const previous = pagesRef.current;
      const sameLayout = next.map(page => page.id).join('|') === previous.map(page => page.id).join('|');
      const sameContent = sameLayout && next.every((page, pageIndex) => page.blocks.every((block, blockIndex) => block === previous[pageIndex].blocks[blockIndex]));
      if (sameContent) return;
      const anchor = selectedBlockRef.current;
      const nextIndex = Math.max(0, next.findIndex(page => page.blocks.some(block => block.id === anchor)));
      pagesRef.current = next;
      setDeckPages(next);
      setPosition(position => ({ ...position, index: nextIndex }));
    };
    const schedule = () => {
      if (!alive) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    observer?.observe(viewport);
    Array.from(measureRoot.children).forEach(block => observer?.observe(block));
    window.addEventListener('resize', schedule);
    document.fonts?.ready.then(schedule).catch(() => {});
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [compact, pages]);

  const move = amount => setPosition(previous => ({
    index: ((Math.min(previous.index, deckPages.length - 1) + amount) % deckPages.length + deckPages.length) % deckPages.length,
    direction: amount > 0 ? 1 : -1,
  }));
  const select = nextIndex => setPosition(previous => nextIndex === previous.index ? previous : ({
    index: nextIndex,
    direction: nextIndex > previous.index ? 1 : -1,
  }));
  const onControlsKeyDown = event => {
    if (event.altKey || event.ctrlKey || event.metaKey || !event.target.closest('[data-deck-control]')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
  };
  /* Keep large adaptive decks' controls compact without reducing the touch targets. */
  const dotStart = Math.max(0, Math.min(safeIndex - 2, deckPages.length - 5));
  const visibleDots = deckPages.slice(dotStart, dotStart + 5);

  return <section className={`about-deck ${className}`.trim()} aria-label={label} aria-roledescription="carousel" data-page={current.id} data-direction={direction} data-compact={compact}>
    <div className="about-deck__eyebrow"><span>{label}</span><span className="about-deck__count" aria-hidden="true">{String(safeIndex + 1).padStart(2, '0')}<i>/</i>{String(deckPages.length).padStart(2, '0')}</span></div>
    <div className="about-deck__viewport" ref={viewportRef}>
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        <DeckPage key={current.id} current={current} direction={direction} id={pageId(current)} index={safeIndex} total={deckPages.length} reducedMotion={reducedMotion} />
      </AnimatePresence>
      <div ref={measureRef} className="about-deck__measure" aria-hidden="true" inert>{pages.flatMap(page => page.blocks.map(block => <div className="about-deck__block" data-block-id={block.id} key={block.id}>{block.content}</div>))}</div>
    </div>
    <div className="about-deck__page-label" aria-live="polite" aria-atomic="true"><span aria-hidden="true">↳</span> {current.label}<span className="about-visually-hidden">, page {safeIndex + 1} of {deckPages.length}</span></div>
    <nav className="about-deck__nav" aria-label={`${label} pages`} onKeyDown={onControlsKeyDown}>
      <button type="button" className="about-deck__arrow" data-deck-control aria-label={`Previous ${label.toLowerCase()} page`} onClick={() => move(-1)}><ArrowIcon previous /></button>
      <div className="about-deck__dots">{visibleDots.map((page, localIndex) => {
        const pageIndex = dotStart + localIndex;
        return <button type="button" key={page.id} data-deck-control data-active={safeIndex === pageIndex} aria-label={`Show ${page.label}, page ${pageIndex + 1} of ${deckPages.length}`} aria-controls={pageIndex === safeIndex ? pageId(page) : undefined} aria-current={safeIndex === pageIndex ? 'page' : undefined} onClick={() => select(pageIndex)}><span aria-hidden="true" /></button>;
      })}</div>
      <button type="button" className="about-deck__arrow" data-deck-control aria-label={`Next ${label.toLowerCase()} page`} onClick={() => move(1)}><ArrowIcon /></button>
    </nav>
  </section>;
}
/* END OF FILE: ID-COHERENT-HERO-R1 | AboutCardDeck.jsx */
