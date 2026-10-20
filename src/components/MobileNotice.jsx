// CHANGE VERSION: PORTFOLIO-REFINE-R5 | 2026-10-20 | Original uppercase band typography
import { useEffect, useId, useRef, useState } from 'react';
import { asset } from '../utils/assets';
import '../styles/desktop-notice.css';

function MonitorGraphic() {
  const id = `desktop-dots-${useId().replace(/:/g, '')}`;
  return <svg className="desktop-notice__monitor" viewBox="0 0 360 200" aria-hidden="true" focusable="false">
    <defs><pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="currentColor" /></pattern></defs>
    <path className="desktop-notice__orbit" d="M20 151C15 54 283-1 334 68s-82 117-169 96" />
    <rect x="74" y="21" width="221" height="133" rx="13" fill="var(--blue)" stroke="var(--ink)" strokeWidth="3" />
    <rect x="63" y="14" width="221" height="133" rx="13" fill="var(--amber)" stroke="var(--ink)" strokeWidth="3" />
    <rect x="75" y="27" width="197" height="102" rx="5" fill="var(--ink)" />
    <path d="M85 38h176" stroke="var(--line)" />
    <circle cx="86" cy="33" r="1.8" fill="var(--coral)" /><circle cx="93" cy="33" r="1.8" fill="var(--amber)" /><circle cx="100" cy="33" r="1.8" fill="var(--blue)" />
    <path d="M117 57c-9 0-12 4-12 11v7c0 5-2 7-7 7 5 0 7 2 7 7v7c0 7 3 11 12 11m115-50c9 0 12 4 12 11v7c0 5 2 7 7 7-5 0-7 2-7 7v7c0 7-3 11-12 11" stroke="var(--amber)" strokeWidth="4" fill="none" />
    <path d="m137 70 13 13-13 13m27 0h35" stroke="var(--blue)" strokeWidth="5" fill="none" strokeLinecap="square" />
    <path d="M153 148v23h43v-23m-60 28h77" stroke="var(--ink)" strokeWidth="4" fill="var(--coral)" strokeLinecap="round" />
    <rect x="20" y="37" width="46" height="46" rx="6" fill="var(--coral)" stroke="var(--ink)" strokeWidth="2" transform="rotate(-10 43 60)" />
    <path d="m42 47 2.4 8.6L53 58l-8.6 2.4L42 69l-2.4-8.6L31 58l8.6-2.4Z" fill="var(--ink)" />
    <rect x="265" y="128" width="68" height="47" rx="5" fill="var(--paper, #f2e9d6)" stroke="var(--ink)" strokeWidth="2" transform="rotate(8 299 151)" />
    <path d="m286 147 8 8 16-18" fill="none" stroke="var(--ink)" strokeWidth="4" />
    <path d="M15 179h74m211-150h42m-22-19v41" stroke="var(--blue)" strokeWidth="1.5" opacity=".7" />
    <rect x="278" y="52" width="60" height="63" fill={`url(#${id})`} opacity=".6" />
  </svg>;
}

export default function MobileNotice({ mode = 'mobile' }) {
  const compact = mode === 'compact';
  const [copyState, setCopyState] = useState('idle');
  const [pageUrl] = useState(() => typeof window === 'undefined' ? '' : window.location.href);
  const input = useRef(null);
  const mounted = useRef(true);
  const copyFrame = useRef(0);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; cancelAnimationFrame(copyFrame.current); };
  }, []);

  const copyLink = async () => {
    setCopyState('copying');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(pageUrl);
      if (mounted.current) setCopyState('copied');
    } catch {
      if (!mounted.current) return;
      setCopyState('select');
      copyFrame.current = requestAnimationFrame(() => { input.current?.focus(); input.current?.select(); });
    }
  };

  return <main className="desktop-notice" data-mode={mode} aria-labelledby="desktop-notice-title">
    <div className="desktop-notice__poster">
      <div className="desktop-notice__brand"><img src={asset('brand/triangle-logo.png?v=PORTFOLIO-POLISH-R3')} alt="" width="27" height="27" /><span>gbppimentel<span>-dev</span></span></div>
      <div className="desktop-notice__band"><span className="desktop-notice__band-copy"><span>{compact ? 'A LITTLE MORE ROOM' : 'MOBILE IN PROGRESS'}</span></span><span aria-hidden="true">✦</span></div>
      <div className="desktop-notice__body">
        <MonitorGraphic />
        <h1 id="desktop-notice-title">{compact ? <>Give this page<br /><em>some space.</em></> : <>Built for<br /><em>the big screen.</em></>}</h1>
        <p className="desktop-notice__description">{compact
          ? 'Maximize your browser window to explore the desktop portfolio.'
          : 'Open this portfolio on your computer for the full experience. It’s optimized for desktop, with animations and interactive features made to explore.'}</p>
        <div className="desktop-notice__actions">
          <button type="button" className="desktop-notice__copy" data-copy-state={copyState} onClick={copyLink} disabled={copyState === 'copying'} aria-busy={copyState === 'copying'} aria-label={copyState === 'copied' ? 'link copied!' : copyState === 'copying' ? 'copying…' : 'copy website link'}>
            <span className="desktop-notice__copy-icons" aria-hidden="true">
              <svg className="desktop-notice__copy-icon" viewBox="0 0 20 20" focusable="false"><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M12 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h2" /></svg>
              <svg className="desktop-notice__copied-icon" viewBox="0 0 20 20" focusable="false"><path d="m4 10 4 4 8-8" /></svg>
            </span>
            <span className="desktop-notice__copy-labels" aria-hidden="true"><span data-label="idle">copy website link</span><span data-label="copying">copying…</span><span data-label="copied">link copied!</span></span>
          </button>
          <a href={asset('Pimentel-Resume-IT.pdf')} target="_blank" rel="noopener noreferrer"><span>view CV</span><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M11 3h6v6M17 3 8 12M9 4H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-4" /></svg></a>
        </div>
        <label className="desktop-notice__address"><span>TAKE IT TO YOUR DESKTOP</span><input ref={input} aria-label="Website address" value={pageUrl} readOnly onFocus={event => event.currentTarget.select()} /></label>
        <p className="desktop-notice__status" role="status" aria-live="polite">{copyState === 'copied' ? 'Website link copied. Open it on your computer.' : copyState === 'select' ? 'Select and copy the website address, or press and hold it on your phone.' : ''}</p>
      </div>
      <div className="desktop-notice__foot"><span>personal portfolio</span><small>by <em>Glenn Bernard Pimentel</em></small></div>
    </div>
  </main>;
}
// END OF FILE: PORTFOLIO-REFINE-R5 | MobileNotice.jsx
