// CHANGE VERSION: DESKTOP-POLISH-R1 | 2026-10-20 | Desktop launch gate
import { useEffect, useState } from 'react';
import MobileNotice from './MobileNotice';

/** Keep known phones/tablets gated in landscape and in desktop-request mode. */
export function classifyDevice({ userAgent = '', platform = '', maxTouchPoints = 0, mobile = false, width = Infinity, coarse = false } = {}) {
  const phone = mobile || /iPhone|iPod|Android.*Mobile|Windows Phone|IEMobile|Opera Mini/i.test(userAgent);
  const tablet = /iPad|Android/i.test(userAgent) || (platform === 'MacIntel' && maxTouchPoints > 1);
  if (phone || tablet || (coarse && width < 1000)) return 'mobile';
  return width < 1000 ? 'compact' : 'desktop';
}

export function readDeviceMode() {
  if (typeof window === 'undefined') return 'desktop';
  const device = window.navigator;
  return classifyDevice({
    userAgent: device?.userAgent ?? '',
    platform: device?.platform ?? '',
    maxTouchPoints: device?.maxTouchPoints ?? 0,
    mobile: device?.userAgentData?.mobile === true,
    width: window.innerWidth,
    coarse: window.matchMedia?.('(pointer: coarse)')?.matches ?? false,
  });
}

export default function DesktopGate({ children }) {
  // Decide before rendering children: desktop effects never mount on mobile.
  const [mode, setMode] = useState(readDeviceMode);
  useEffect(() => {
    const preference = window.matchMedia?.('(pointer: coarse)');
    const update = () => setMode(readDeviceMode());
    window.addEventListener('resize', update, { passive: true });
    window.addEventListener('orientationchange', update, { passive: true });
    preference?.addEventListener?.('change', update);
    update();
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      preference?.removeEventListener?.('change', update);
    };
  }, []);

  return mode === 'desktop' ? children : <MobileNotice mode={mode} />;
}
// END OF FILE: DESKTOP-POLISH-R1 | DesktopGate.jsx
