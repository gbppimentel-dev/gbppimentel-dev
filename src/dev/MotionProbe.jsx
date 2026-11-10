import { useEffect, useRef, useState } from 'react';

const canvasWork = () => [...document.querySelectorAll('canvas')].map(node => ({
  name: node.className, width: node.width, height: node.height,
  draws: Number(node.dataset.lanyardRenders || node.dataset.crosshairRenders || 0),
}));

// Development-only, opt-in measurement. No per-frame React writes or production UI.
export default function MotionProbe() {
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState(null);
  const [bypassArtworkFilters, setBypassArtworkFilters] = useState(false);
  const [loaderReport, setLoaderReport] = useState(null);
  const [previewPhase, setPreviewPhase] = useState(null);
  const previewSnapshot = useRef(null);
  const restorePreview = () => {
    const saved = previewSnapshot.current;
    if (!saved) return;
    saved.overlay.classList.toggle('is-visible', saved.visible);
    saved.overlay.dataset.animate = saved.animate;
    saved.animations.forEach(({ animation, state, time }) => {
      animation.currentTime = time;
      if (state === 'running') animation.play();
      else animation.pause();
    });
    previewSnapshot.current = null;
  };
  const previewLoader = time => {
    const overlay = document.getElementById('portfolio-page-loader');
    if (!overlay) return;
    if (!previewSnapshot.current) previewSnapshot.current = {
      overlay, visible: overlay.classList.contains('is-visible'), animate: overlay.dataset.animate,
      animations: overlay.getAnimations({ subtree: true }).filter(animation => typeof animation.animationName === 'string').map(animation => ({ animation, state: animation.playState, time: animation.currentTime })),
    };
    overlay.classList.add('is-visible');
    overlay.dataset.animate = 'true';
    // Keep the overlay's opacity/visibility transitions running; freeze only
    // named shape/color/echo CSS animations for the selected diagnostic pose.
    overlay.getAnimations({ subtree: true }).filter(animation => typeof animation.animationName === 'string').forEach(animation => { animation.pause(); animation.currentTime = time; });
    setPreviewPhase(time);
  };
  const cancel = useRef(() => {});
  useEffect(() => () => { cancel.current(); restorePreview(); }, []);
  useEffect(() => {
    if (!new URLSearchParams(location.search).has('loader-check')) return undefined;
    const overlay = document.getElementById('portfolio-page-loader');
    if (!overlay?.classList.contains('is-visible')) {
      setLoaderReport({ sampleMissed: true, reason: 'The diagnostic arrived after loader dismissal; refresh to sample startup.' });
      return undefined;
    }
    const started = performance.now(), frames = [], tasks = [];
    let frame = 0, previous = 0, introFrames = 0, introCanvases = 0, introSurface = false, contentPhase = 0, observer;
    let echoSamples = 0, echoGeometryMismatches = 0, echoColorMismatches = 0;
    try {
      observer = new PerformanceObserver(list => tasks.push(...list.getEntries().map(entry => ({ start: entry.startTime, duration: entry.duration }))));
      observer.observe({ type: 'longtask', buffered: true });
    } catch { /* Frame and scene sampling still work without long-task support. */ }
    const tick = now => {
      if (previous) frames.push(now - previous);
      previous = now;
      if (overlay.classList.contains('is-visible')) {
        const core = getComputedStyle(overlay.querySelector('#portfolio-loader-shape'));
        overlay.querySelectorAll('.loader-echo').forEach(path => {
          const echo = getComputedStyle(path);
          echoSamples += 1;
          if (echo.d !== core.d) echoGeometryMismatches += 1;
          if (echo.stroke !== core.fill) echoColorMismatches += 1;
        });
      }
      if (overlay.dataset.phase === 'intro') {
        introFrames += 1;
        introCanvases = Math.max(introCanvases, document.querySelectorAll('canvas').length);
        introSurface ||= Boolean(document.querySelector('.page-surface'));
      } else if (!contentPhase) contentPhase = now;
      if (overlay.classList.contains('is-visible')) { frame = requestAnimationFrame(tick); return; }
      tasks.push(...(observer?.takeRecords() || []).map(entry => ({ start: entry.startTime, duration: entry.duration })));
      observer?.disconnect();
      const sorted = [...frames].sort((a, b) => a - b);
      const round = value => Math.round(value * 100) / 100;
      setLoaderReport({
        measuredFromNavigationMs: round(started), sampledLoaderMs: round(now - started),
        frames: frames.length, averageFps: round(frames.length * 1000 / Math.max(1, now - started)),
        p95FrameMs: round(sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * .95))] || 0),
        framesOver34ms: frames.filter(value => value > 34).length,
        longTasksSinceNavigation: tasks.length, longTaskMs: round(tasks.reduce((sum, entry) => sum + entry.duration, 0)),
        longTaskTimings: tasks.map(entry => ({ startMs: round(entry.start), durationMs: round(entry.duration) })),
        contentPhaseFromNavigationMs: round(contentPhase),
        introFrames, maxCanvasesDuringIntro: introCanvases, surfaceMountedDuringIntro: introSurface,
        geometryMorphTracks: overlay.querySelectorAll('.loader-shape').length,
        echoInstances: overlay.querySelectorAll('.loader-echo').length,
        echoSamples, echoGeometryMismatches, echoColorMismatches,
        viewport: [innerWidth, innerHeight], visibleAtEnd: !document.hidden,
      });
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); };
  }, []);
  const measure = (duration = 6000) => {
    if (running) return;
    setRunning(true);
    const frames = [], tasks = [], animationFrames = [];
    const canvasWorkBefore = canvasWork();
    let frame = 0, start = 0, previous = 0, observer, animationObserver;
    try {
      observer = new PerformanceObserver(list => tasks.push(...list.getEntries().map(entry => entry.duration)));
      observer.observe({ type: 'longtask', buffered: false });
    } catch { /* The frame sample works in browsers without long-task entries. */ }
    try {
      animationObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (animationFrames.length < 64) animationFrames.push({
          durationMs: Math.round(entry.duration), blockingMs: Math.round(entry.blockingDuration),
          styleAndLayoutMs: entry.styleAndLayoutStart ? Math.round(entry.startTime + entry.duration - entry.styleAndLayoutStart) : 0,
          scripts: [...entry.scripts].map(script => ({ source: script.sourceURL, invoker: script.invoker,
            durationMs: Math.round(script.duration), forcedStyleAndLayoutMs: Math.round(script.forcedStyleAndLayoutDuration) })),
        });
      });
      animationObserver.observe({ type: 'long-animation-frame', buffered: false });
    } catch { /* Older browsers still expose RAF and long-task measurements. */ }
    cancel.current = () => { cancelAnimationFrame(frame); observer?.disconnect(); animationObserver?.disconnect(); };
    const tick = now => {
      if (!start) start = now;
      if (previous) frames.push(now - previous);
      previous = now;
      if (now - start < duration) { frame = requestAnimationFrame(tick); return; }
      observer?.disconnect();
      animationObserver?.disconnect();
      const sorted = [...frames].sort((a, b) => a - b);
      const round = value => Math.round(value * 100) / 100;
      const quantile = p => round(sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))] || 0);
      setReport({
        durationMs: round(now - start), frames: frames.length,
        averageFps: round(frames.length * 1000 / (now - start)),
        medianFrameMs: quantile(.5), p95FrameMs: quantile(.95),
        framesOver34ms: frames.filter(value => value > 34).length,
        longTasks: tasks.length, longTaskMs: round(tasks.reduce((a, b) => a + b, 0)),
        viewport: [innerWidth, innerHeight], visible: !document.hidden,
        metric: 'requestAnimationFrame cadence, not presented GPU frames',
        bypassArtworkFilters,
        slowAnimationFrames: animationFrames.sort((a, b) => b.durationMs - a.durationMs).slice(0, 5),
        canvasWork: { before: canvasWorkBefore, after: canvasWork() },
        scene: document.querySelector('#home')?.dataset.covered === 'true' ? location.hash || 'scrolled' : document.querySelector('.swiper-slide-active .slide-inner')?.className,
        canvases: [...document.querySelectorAll('canvas')].map(node => ({ width: node.width, height: node.height })),
      });
      setRunning(false);
    };
    frame = requestAnimationFrame(tick);
  };
  return <aside aria-label="Development motion measurement" style={{ position: 'fixed', zIndex: 20000, bottom: 8, left: 8, width: 270, padding: 12, border: '1px solid #93aec6', borderRadius: 6, background: '#10151e', color: '#f2efe8', font: '11px/1.5 monospace' }}>
    {bypassArtworkFilters && <style>{'.slide-art,.section-art,.contact-art{filter:none!important}'}</style>}
    <div style={{ display: 'flex', gap: 6 }}>
      <button type="button" onClick={() => measure()} disabled={running} style={{ padding: 8, color: '#10151e', background: '#d8b97c', border: 0, borderRadius: 3 }}>{running ? 'Measuring motion…' : 'Measure 6 seconds'}</button>
      <button type="button" onClick={() => measure(12000)} disabled={running} style={{ padding: 8 }}>Measure 12 seconds</button>
    </div>
    <label style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 8 }}><input type="checkbox" checked={bypassArtworkFilters} disabled={running} onChange={event => setBypassArtworkFilters(event.target.checked)} />Bypass artwork filters (A/B)</label>
    <small>Measures animation scheduling, not actual display FPS.</small>
    <output data-motion-report style={{ display: 'block', marginTop: 8, overflowWrap: 'anywhere' }}>{report ? JSON.stringify(report) : 'Ready. Keep this view still during the sample.'}</output>
    {new URLSearchParams(location.search).has('loader-check') && <output data-loader-report style={{ display: 'block', marginTop: 8, overflowWrap: 'anywhere' }}>{loaderReport ? JSON.stringify(loaderReport) : 'Sampling the refresh loader…'}</output>}
    {new URLSearchParams(location.search).has('loader-check') && <div data-loader-preview style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
      {[[0, 'Square'], [350, 'Octagon'], [700, 'Circle'], [245, 'Early echo'], [595, 'Middle echo'], [945, 'Late echo']].map(([time, label]) => <button type="button" key={time} disabled={!loaderReport} onClick={() => previewLoader(time)} style={{ padding: 6, border: '1px solid #93aec6', borderRadius: 3, background: previewPhase === time ? '#d8b97c' : '#1b2532', color: previewPhase === time ? '#10151e' : '#f2efe8' }}>{label}</button>)}
      {previewPhase !== null && <button type="button" onClick={() => { restorePreview(); setPreviewPhase(null); }} style={{ padding: 6 }}>Close loader preview</button>}
    </div>}
  </aside>;
}
