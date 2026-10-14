// CHANGE VERSION: NAV-TYPE-R2 | 2026-10-14 | Complete TerminalText.jsx
import { Children, cloneElement, isValidElement, useLayoutEffect, useRef } from 'react';
import { useSwiperSlide } from 'swiper/react';

export default function TerminalText({ children, reduced = false }) {
  const ref = useRef(null), slide = useSwiperSlide();
  const active = slide ? slide.isActive : true;
  let index = 0;
  const reveal = nodes => Children.map(nodes, node => {
    if (typeof node === 'string' || typeof node === 'number') return Array.from(String(node), char => <span key={index++} className="hero-terminal-char">{char}</span>);
    return isValidElement(node) && node.props.children != null ? cloneElement(node, {}, reveal(node.props.children)) : node;
  });
  const content = reveal(children);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || !active || reduced) return;
    const chars = Array.from(node.querySelectorAll('.hero-terminal-char'));
    let next = 350;
    const beats = chars.map((char, i) => {
      const at = next, value = char.textContent;
      next += value === ',' ? 100 : '(."'.includes(value) ? 52 : value === ' ' ? 24 : [32, 38, 30, 36][i % 4];
      return at;
    });
    const started = performance.now();
    let frame = 0, visible = 0, done = false;
    // The full statement is the default. Only the running reveal hides letters.
    const finish = () => {
      done = true;
      cancelAnimationFrame(frame); clearTimeout(deadline);
      delete node.dataset.typing;
      chars.forEach(char => { delete char.dataset.terminalHidden; delete char.dataset.cursor; });
    };
    // Complete even when animation frames are throttled or the slide unmounts.
    const deadline = setTimeout(finish, next + 150);
    node.dataset.typing = 'waiting';
    chars.forEach(char => { char.dataset.terminalHidden = 'true'; });
    const tick = now => {
      if (done) return;
      let count = visible;
      while (count < chars.length && now - started >= beats[count]) count++;
      if (count !== visible) {
        node.dataset.typing = 'true';
        if (visible) delete chars[visible - 1].dataset.cursor;
        for (let i = visible; i < count; i++) delete chars[i].dataset.terminalHidden;
        if (count) chars[count - 1].dataset.cursor = 'true';
        visible = count;
      }
      if (count === chars.length) finish();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return finish;
  }, [active, reduced, index]);
  return <span ref={ref} className="hero-terminal-text" aria-hidden="true"><span className="hero-terminal-prompt">›</span>{content}<span className="hero-terminal-caret" /></span>;
}
// END OF FILE: NAV-TYPE-R2 | TerminalText.jsx
