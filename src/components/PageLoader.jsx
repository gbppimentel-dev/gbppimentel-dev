import { useLayoutEffect } from 'react';
import { useAnimationPreferences } from '../hooks/useAnimationActivity';
import '../styles/page-loader.css';

// Adopt the first-paint HTML loader instead of mounting a second overlay after
// the application bundle has initialized. Its original morph starts in CSS.
export default function PageLoader({ visible, preparing = false }) {
  const { documentVisible, reducedMotion } = useAnimationPreferences();
  useLayoutEffect(() => {
    const overlay = document.getElementById('portfolio-page-loader');
    if (!overlay) return;
    overlay.classList.toggle('is-visible', visible);
    overlay.dataset.animate = String(visible && documentVisible && !reducedMotion);
    overlay.dataset.phase = preparing ? 'intro' : 'content';
    overlay.setAttribute('aria-hidden', String(!visible));
    if (visible) {
      overlay.setAttribute('role', 'status');
      overlay.setAttribute('aria-label', 'Loading page');
    } else {
      overlay.removeAttribute('role');
      overlay.removeAttribute('aria-label');
    }
  }, [visible, preparing, documentVisible, reducedMotion]);
  return null;
}
