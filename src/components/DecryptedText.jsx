// CHANGE VERSION: PORTFOLIO-POLISH-R12 | 2026-10-15 | Complete DecryptedText.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';

const wrapperStyle = { display: 'inline-block', whiteSpace: 'pre-wrap' };
const srOnlyStyle = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0
};

function revealOrder(text, direction) {
  const indices = Array.from(text)
    .map((char, index) => ({ char, index }))
    .filter(item => !/\s/.test(item.char))
    .map(item => item.index);

  if (direction === 'end') return indices.reverse();
  if (direction === 'center') {
    const result = [];
    const middle = Math.floor((indices.length - 1) / 2);
    for (let offset = 0; result.length < indices.length; offset++) {
      const right = middle + offset;
      const left = middle - offset - 1;
      if (right < indices.length) result.push(indices[right]);
      if (left >= 0 && result.length < indices.length) result.push(indices[left]);
    }
    return result;
  }
  return indices;
}

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  encryptedPalette = [],
  animateOn = 'hover',
  clickMode = 'once',
  replayKey,
  startDelay = 0,
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [revealedIndices, setRevealedIndices] = useState(() => new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(animateOn !== 'click');
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const startTimerRef = useRef(null);
  const startAnimationRef = useRef(null);
  const resetToPlainTextRef = useRef(null);

  const availableChars = useMemo(() => {
    if (!useOriginalCharsOnly) return Array.from(characters);
    return Array.from(new Set(Array.from(text).filter(char => !/\s/.test(char))));
  }, [characters, text, useOriginalCharsOnly]);

  const order = useMemo(() => revealOrder(text, revealDirection), [text, revealDirection]);

  const scramble = useCallback((revealed = new Set()) => {
    return Array.from(text).map((char, index) => {
      if (/\s/.test(char) || revealed.has(index)) return char;
      if (!availableChars.length) return char;
      return availableChars[Math.floor(Math.random() * availableChars.length)];
    }).join('');
  }, [availableChars, text]);

  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    window.clearTimeout(startTimerRef.current);
    window.clearInterval(intervalRef.current);
    const empty = new Set();
    setRevealedIndices(empty);
    setDisplayText(scramble(empty));
    setIsDecrypted(false);
    setHasAnimated(true);
    if (order.length === 0) {
      setDisplayText(text);
      setIsDecrypted(true);
      return;
    }
    setIsAnimating(true);
  }, [isAnimating, order.length, scramble, text]);

  const resetToPlainText = useCallback(() => {
    window.clearTimeout(startTimerRef.current);
    window.clearInterval(intervalRef.current);
    setIsAnimating(false);
    setRevealedIndices(new Set());
    setDisplayText(text);
    setIsDecrypted(true);
  }, [text]);

  startAnimationRef.current = startAnimation;
  resetToPlainTextRef.current = resetToPlainText;

  useEffect(() => {
    setDisplayText(text);
    setRevealedIndices(new Set());
    setIsAnimating(false);
    setIsDecrypted(animateOn !== 'click');
    setHasAnimated(false);
    return () => {
      window.clearTimeout(startTimerRef.current);
      window.clearInterval(intervalRef.current);
    };
  }, [animateOn, text]);

  useEffect(() => {
    if (replayKey === undefined) return undefined;
    window.clearTimeout(startTimerRef.current);
    if (replayKey === null) {
      resetToPlainTextRef.current?.();
      setHasAnimated(false);
      return undefined;
    }
    startTimerRef.current = window.setTimeout(
      () => startAnimationRef.current?.(),
      Math.max(0, Number(startDelay) || 0)
    );
    return () => window.clearTimeout(startTimerRef.current);
  }, [replayKey, startDelay]);

  useEffect(() => {
    if (!isAnimating) return undefined;
    let step = 0;
    let iteration = 0;
    const delay = Math.max(12, Number(speed) || 50);

    intervalRef.current = window.setInterval(() => {
      if (sequential) {
        step += 1;
        const nextRevealed = new Set(order.slice(0, step));
        setRevealedIndices(nextRevealed);
        if (step >= order.length) {
          window.clearInterval(intervalRef.current);
          setDisplayText(text);
          setIsAnimating(false);
          setIsDecrypted(true);
        } else {
          setDisplayText(scramble(nextRevealed));
        }
        return;
      }

      iteration += 1;
      if (iteration >= Math.max(1, maxIterations)) {
        window.clearInterval(intervalRef.current);
        setDisplayText(text);
        setRevealedIndices(new Set(order));
        setIsAnimating(false);
        setIsDecrypted(true);
      } else {
        setDisplayText(scramble(new Set()));
      }
    }, delay);

    return () => window.clearInterval(intervalRef.current);
  }, [isAnimating, maxIterations, order, scramble, sequential, speed, text]);

  useEffect(() => {
    if ((animateOn !== 'view' && animateOn !== 'inViewHover') || hasAnimated) return undefined;
    const node = containerRef.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      startAnimation();
      return undefined;
    }

    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        startAnimation();
        observer.disconnect();
      }
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    observer.observe(node);
    return () => observer.disconnect();
  }, [animateOn, hasAnimated, startAnimation]);

  const handleClick = () => {
    if (animateOn !== 'click') return;
    if (clickMode === 'once' && hasAnimated) return;
    if (clickMode === 'toggle' && isDecrypted && hasAnimated) {
      setHasAnimated(false);
      setIsDecrypted(false);
      setDisplayText(scramble(new Set()));
      setRevealedIndices(new Set());
      return;
    }
    startAnimation();
  };

  const motionProps = animateOn === 'hover' || animateOn === 'inViewHover'
    ? { onMouseEnter: startAnimation, onMouseLeave: animateOn === 'hover' ? resetToPlainText : undefined }
    : animateOn === 'click' ? { onClick: handleClick } : {};

  return (
    <motion.span ref={containerRef} className={parentClassName} style={wrapperStyle} {...motionProps} {...props}>
      <span style={srOnlyStyle}>{text}</span>
      <span aria-hidden="true">
        {Array.from(displayText).map((char, index) => {
          const revealed = revealedIndices.has(index) || (!isAnimating && isDecrypted);
          const color = encryptedPalette.length
            ? encryptedPalette[Math.floor(Math.random() * encryptedPalette.length)]
            : undefined;
          return <span
            key={index}
            className={revealed ? className : encryptedClassName}
            style={!revealed && color ? { '--decrypt-color': color } : undefined}
          >{char}</span>;
        })}
      </span>
    </motion.span>
  );
}
// END OF FILE: PORTFOLIO-POLISH-R12 | DecryptedText.jsx
