import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';

// Fixed scenes may be inside the viewport but fully covered by another section.
export const AnimationActivityContext = createContext(true);

const serverSnapshot = { documentVisible: true, reducedMotion: true, coarsePointer: false };
let snapshot = serverSnapshot;
let stopPreferences;
const subscribers = new Set();

function readPreferences() {
  if (typeof window === 'undefined') return serverSnapshot;
  return {
    documentVisible: !document.hidden,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    coarsePointer: window.matchMedia('(pointer: coarse)').matches,
  };
}

function updatePreferences() {
  const next = readPreferences();
  if (Object.keys(next).every(key => next[key] === snapshot[key])) return;
  snapshot = next;
  subscribers.forEach(listener => listener());
}

function getClientSnapshot() {
  // No listeners exist between route unmount/remount. Read the current tab and
  // media state before the first new render rather than exposing a stale cache.
  if (!subscribers.size) updatePreferences();
  return snapshot;
}

function subscribe(listener) {
  subscribers.add(listener);
  if (!stopPreferences && typeof window !== 'undefined') {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(pointer: coarse)');
    motion.addEventListener('change', updatePreferences);
    pointer.addEventListener('change', updatePreferences);
    document.addEventListener('visibilitychange', updatePreferences);
    stopPreferences = () => {
      motion.removeEventListener('change', updatePreferences);
      pointer.removeEventListener('change', updatePreferences);
      document.removeEventListener('visibilitychange', updatePreferences);
      stopPreferences = undefined;
    };
    updatePreferences();
  }
  return () => {
    subscribers.delete(listener);
    if (!subscribers.size) stopPreferences?.();
  };
}

export function useAnimationPreferences() {
  return useSyncExternalStore(subscribe, getClientSnapshot, () => serverSnapshot);
}

/** Observe the shared component, including clipping by carousel/scroll parents. */
export default function useAnimationActivity(ref, { enabled = true, rootMargin = '0px', threshold = 0 } = {}) {
  const parentActive = useContext(AnimationActivityContext);
  const preferences = useAnimationPreferences();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) { setVisible(false); return undefined; }
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return undefined; }
    const observer = new IntersectionObserver(entries => {
      setVisible(entries.some(entry => entry.isIntersecting));
    }, { rootMargin, threshold });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, enabled, rootMargin, threshold]);
  return { ...preferences, visible, active: enabled && parentActive && visible && preferences.documentVisible && !preferences.reducedMotion };
}
