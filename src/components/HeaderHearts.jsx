// CHANGE VERSION: DESKTOP-POLISH-R1 | 2026-10-20 | Quiet header appreciation
import { useCallback, useEffect, useRef, useState } from 'react';
import PulseHeart from './PulseHeart';
import { getPortfolioHeartsConfig, getPortfolioHeartState, setPortfolioHeart } from '../utils/portfolioHearts';
import '../styles/header-hearts.css';

export default function HeaderHearts() {
  const [config] = useState(getPortfolioHeartsConfig);
  const [snapshot, setSnapshot] = useState({ liked: false, count: null });
  const [confirmedLiked, setConfirmedLiked] = useState(false);
  const [phase, setPhase] = useState(config.configured ? 'loading' : 'unavailable');
  const [message, setMessage] = useState('');
  const latest = useRef(snapshot);
  const alive = useRef(false);
  const busy = useRef(false);
  const request = useRef(null);
  const sequence = useRef(0);
  latest.current = snapshot;

  const refresh = useCallback(async ({ quiet = false } = {}) => {
    if (!config.configured || busy.current) return;
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    const current = ++sequence.current;
    if (!quiet) { setPhase('loading'); setMessage(''); }
    try {
      const result = await getPortfolioHeartState({ signal: controller.signal });
      if (!alive.current || sequence.current !== current) return;
      latest.current = result;
      setSnapshot(result);
      setConfirmedLiked(result.liked);
      setPhase('ready');
      setMessage('');
    } catch (error) {
      if (!alive.current || sequence.current !== current || error.name === 'AbortError') return;
      setPhase(latest.current.count === null ? 'error' : 'ready');
      setMessage('Couldn’t refresh hearts. Try again.');
    } finally {
      if (sequence.current === current) request.current = null;
    }
  }, [config.configured]);

  useEffect(() => {
    alive.current = true;
    refresh();
    const onReturn = () => {
      if (!document.hidden) refresh({ quiet: latest.current.count !== null });
    };
    window.addEventListener('focus', onReturn);
    window.addEventListener('online', onReturn);
    return () => {
      alive.current = false;
      sequence.current += 1;
      request.current?.abort();
      request.current = null;
      busy.current = false;
      window.removeEventListener('focus', onReturn);
      window.removeEventListener('online', onReturn);
    };
  }, [refresh]);

  const changeHeart = async liked => {
    if (!config.configured || busy.current || phase !== 'ready' || latest.current.count === null) return;
    const previous = latest.current;
    if (liked === previous.liked) return;
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    const current = ++sequence.current;
    busy.current = true;
    const optimistic = { liked, count: Math.max(0, previous.count + (liked ? 1 : -1)) };
    latest.current = optimistic;
    setSnapshot(optimistic);
    setPhase('saving');
    setMessage('');
    try {
      const result = await setPortfolioHeart(liked, { signal: controller.signal });
      if (!alive.current || sequence.current !== current) return;
      latest.current = result;
      setSnapshot(result);
      setConfirmedLiked(result.liked);
      setMessage(result.liked ? 'Thanks!' : 'Heart removed.');
    } catch (error) {
      if (!alive.current || sequence.current !== current || error.name === 'AbortError') return;
      latest.current = previous;
      setSnapshot(previous);
      setMessage('Couldn’t save your heart. Please try again.');
    } finally {
      if (alive.current && sequence.current === current) {
        busy.current = false;
        request.current = null;
        setPhase('ready');
      }
    }
  };

  const canRetry = config.configured && phase !== 'loading' && phase !== 'saving'
    && (phase === 'error' || message.startsWith('Couldn’t refresh'));
  const hasError = message.startsWith('Couldn’t');
  const status = phase === 'loading' ? 'Loading hearts.'
    : phase === 'saving' ? 'Saving your heart.'
      : phase === 'unavailable' ? 'Hearts are temporarily unavailable.'
        : message || (confirmedLiked ? 'Thanks!' : 'Loved what you see? Give this page a heart!');

  return <div className="header-hearts" data-state={phase} data-thanked={confirmedLiked} data-error={hasError} data-retry={canRetry} data-copy={hasError ? 'error' : confirmedLiked ? 'thanks' : 'invite'}>
    <span className="header-hearts__copy" aria-hidden="true">
      <span className="header-hearts__copy-layer" data-copy="invite"><span className="header-hearts__prompt">Loved what you see?</span><span className="header-hearts__invitation">Give this page a heart!</span><span className="header-hearts__compact">Give a heart</span></span>
      <span className="header-hearts__copy-layer" data-copy="thanks"><span className="header-hearts__prompt">Thanks!</span><span className="header-hearts__invitation">Appreciate the feedback.</span><span className="header-hearts__compact">Thanks!</span></span>
      <span className="header-hearts__copy-layer" data-copy="error"><span className="header-hearts__prompt">Try again</span><span className="header-hearts__invitation">Please try that once more.</span><span className="header-hearts__compact">Try again</span></span>
    </span>
    <PulseHeart liked={snapshot.liked} count={snapshot.count ?? 0} showCount={snapshot.count !== null}
      onChange={changeHeart} disabled={phase !== 'ready'} size={19} corner={8}
      duration={680} dotSize={0.58} overshoot={0.7} beat={0.6} rollDuration={440}
      likedColor="var(--coral, #d98d83)" idleColor="var(--muted, #aaa8a7)"
      pillColor="transparent" textColor="var(--muted, #aaa8a7)"
      label={confirmedLiked ? 'Thanks! Remove your heart' : snapshot.liked ? 'Remove your heart' : 'Loved what you see? Give this page a heart!'} />
    {canRetry && <button type="button" className="header-hearts__retry" onClick={() => refresh()}>Retry</button>}
    <span className="header-hearts__status" role="status" aria-live="polite">{status}</span>
  </div>;
}
// END OF FILE: DESKTOP-POLISH-R1 | HeaderHearts.jsx
