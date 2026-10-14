// CHANGE VERSION: PORTFOLIO-POLISH-R4 | 2026-10-14 | Complete RotatingText.jsx
// React Bits RotatingText: content-sized boxes with coordinated sibling layout motion.
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import '../styles/RotatingText.css';
const cn = (...classes) => classes.filter(Boolean).join(' ');
const RotatingText = forwardRef((props, ref) => {
  const { texts = [], transition = { type: 'spring', damping: 25, stiffness: 300 },
    initial = { y: '100%', opacity: 0 }, animate = { y: 0, opacity: 1 }, exit = { y: '-120%', opacity: 0 },
    animatePresenceMode = 'wait', animatePresenceInitial = false, rotationInterval = 2000,
    staggerDuration = 0, staggerFrom = 'first', loop = true, auto = true, splitBy = 'characters', onNext,
    mainClassName, splitLevelClassName, elementLevelClassName, stableWidth = false, ...rest } = props;
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const currentText = texts[currentTextIndex] ?? texts[0] ?? '';
  const elements = useMemo(() => {
    const splitIntoCharacters = text => typeof Intl !== 'undefined' && Intl.Segmenter
      ? Array.from(new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(text), part => part.segment)
      : Array.from(text);
    const separator = splitBy === 'characters' || splitBy === 'words' ? ' ' : splitBy === 'lines' ? '\n' : splitBy;
    return currentText.split(separator).map((part, i, array) => ({
      characters: splitBy === 'characters' ? splitIntoCharacters(part) : [part], needsSpace: i !== array.length - 1
    }));
  }, [currentText, splitBy]);
  const totalChars = elements.reduce((sum, word) => sum + word.characters.length, 0);
  const getStaggerDelay = useCallback((index, total) => {
    if (staggerFrom === 'first') return index * staggerDuration;
    if (staggerFrom === 'last') return (total - 1 - index) * staggerDuration;
    if (staggerFrom === 'center') return Math.abs(Math.floor(total / 2) - index) * staggerDuration;
    if (staggerFrom === 'random') return Math.abs(Math.floor(Math.random() * total) - index) * staggerDuration;
    return Math.abs(staggerFrom - index) * staggerDuration;
  }, [staggerFrom, staggerDuration]);
  const handleIndexChange = useCallback(index => { setCurrentTextIndex(index); onNext?.(index); }, [onNext]);
  const next = useCallback(() => {
    const index = currentTextIndex === texts.length - 1 ? (loop ? 0 : currentTextIndex) : currentTextIndex + 1;
    if (texts.length && index !== currentTextIndex) handleIndexChange(index);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);
  const previous = useCallback(() => {
    const index = currentTextIndex === 0 ? (loop ? texts.length - 1 : 0) : currentTextIndex - 1;
    if (texts.length && index !== currentTextIndex) handleIndexChange(index);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);
  const jumpTo = useCallback(index => {
    const target = Math.max(0, Math.min(index, texts.length - 1));
    if (target !== currentTextIndex) handleIndexChange(target);
  }, [texts.length, currentTextIndex, handleIndexChange]);
  const reset = useCallback(() => { if (currentTextIndex !== 0) handleIndexChange(0); }, [currentTextIndex, handleIndexChange]);
  useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [next, previous, jumpTo, reset]);
  useEffect(() => {
    if (!auto || texts.length < 2) return;
    const id = setInterval(next, rotationInterval);
    return () => clearInterval(id);
  }, [next, rotationInterval, auto, texts.length]);
  return <motion.span className={cn('text-rotate', stableWidth && 'text-rotate-stable', mainClassName)} {...rest} data-word-index={currentTextIndex} layout transition={transition}>
    <span className="text-rotate-sr-only">{currentText}</span>
    {stableWidth && <span className="text-rotate-sizer" aria-hidden="true">{texts.map((text, index) => <span key={index}>{text}</span>)}</span>}
    <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
      <motion.span key={currentTextIndex} className={splitBy === 'lines' ? 'text-rotate-lines' : 'text-rotate-content'} data-word-index={currentTextIndex} layout="position" aria-hidden="true">
        {elements.map((word, wordIndex, array) => {
          const preceding = array.slice(0, wordIndex).reduce((sum, item) => sum + item.characters.length, 0);
          return <span key={wordIndex} className={cn('text-rotate-word', splitLevelClassName)}>
            {word.characters.map((char, i) => <motion.span key={i} initial={initial} animate={animate} exit={exit}
              transition={{ ...transition, delay: getStaggerDelay(preceding + i, totalChars) }} className={cn('text-rotate-element', elementLevelClassName)}>{char}</motion.span>)}
            {word.needsSpace && <span className="text-rotate-space"> </span>}
          </span>;
        })}
      </motion.span>
    </AnimatePresence>
  </motion.span>;
});
RotatingText.displayName = 'RotatingText';
export default RotatingText;
// END OF FILE: PORTFOLIO-POLISH-R4 | RotatingText.jsx
