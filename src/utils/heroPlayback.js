// CHANGE VERSION: PORTFOLIO-POLISH-R3 | 2026-10-14 | Complete heroPlayback.js
import { useCallback, useEffect, useRef, useState } from 'react';
export const HERO_SLIDE_DELAY = 5500;
const clamp = value => Math.min(1, Math.max(0, value));
export function createHeroPlayback(onPaused = () => {}) {
  let swiper, bar, remaining = HERO_SLIDE_DELAY, restarting = false;
  const hold = { manual: false, hidden: typeof document !== 'undefined' && document.hidden };
  const isPaused = () => hold.manual || hold.hidden;
  const paint = () => { if (bar) bar.style.transform = `scaleX(${clamp(1 - remaining / HERO_SLIDE_DELAY)})`; };
  const sync = () => {
    const paused = isPaused();
    // The icon represents the user's choice, never a temporary hidden-tab hold.
    onPaused(hold.manual);
    if (!swiper || swiper.destroyed) return;
    if (paused && swiper.autoplay.running) {
      if (!swiper.autoplay.paused && Number.isFinite(swiper.autoplay.timeLeft)) remaining = Math.max(0, swiper.autoplay.timeLeft);
      swiper.autoplay.stop(); paint();
    } else if (!paused && !swiper.autoplay.running) {
      // Resume the unfinished countdown; each new slide restores the full delay.
      swiper.params.autoplay.delay = Math.max(16, remaining);
      restarting = true;
      swiper.autoplay.start();
      if (swiper.autoplay.paused) swiper.autoplay.resume();
      restarting = false;
    }
  };
  return {
    bind(instance) { swiper = instance; sync(); },
    setBar(node) { bar = node; paint(); },
    setHold(reason, value) {
      if (reason !== 'hidden') return;
      hold.hidden = value;
      sync();
    },
    toggle() {
      hold.manual = !hold.manual;
      sync();
    },
    timeLeft(instance, milliseconds) {
      if (restarting || isPaused() || !instance.autoplay.running || instance.autoplay.paused) return;
      remaining = Math.min(HERO_SLIDE_DELAY, Math.max(0, milliseconds)); paint();
    },
    reset(instance) { remaining = HERO_SLIDE_DELAY; instance.params.autoplay.delay = HERO_SLIDE_DELAY; paint(); }
  };
}
export function useHeroPlayback() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  if (!ref.current) ref.current = createHeroPlayback(setPaused);
  const player = ref.current;
  const progressRef = useCallback(node => player.setBar(node), [player]);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => setReduced(preference.matches);
    const visibility = () => player.setHold('hidden', document.hidden);
    preference.addEventListener('change', motion); document.addEventListener('visibilitychange', visibility);
    motion(); visibility();
    return () => { preference.removeEventListener('change', motion); document.removeEventListener('visibilitychange', visibility); };
  }, [player]);
  return { player, progressRef, reduced, paused };
}
// END OF FILE: PORTFOLIO-POLISH-R3 | heroPlayback.js
