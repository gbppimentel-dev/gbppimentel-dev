// CHANGE VERSION: HEARTS-PAGES-R1 | 2026-10-20 | Shared no-login portfolio hearts
import { useCallback, useEffect, useRef, useState } from 'react';
import PulseHeart from './PulseHeart';
import { getPortfolioHeartsConfig, getPortfolioHeartState, setPortfolioHeart } from '../utils/portfolioHearts';
import '../styles/footer-hearts.css';

export default function FooterHearts() {
  const [config] = useState(getPortfolioHeartsConfig);
  const [snapshot, setSnapshot] = useState({ liked: false, count: null });
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
      setPhase('ready');
      setMessage('');
    } catch (error) {
      if (!alive.current || sequence.current !== current || error.name === 'AbortError') return;
      setPhase(latest.current.count === null ? 'error' : 'ready');
      setMessage('Couldn’t refresh the hearts. Try again.');
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
      setMessage(result.liked ? 'Heart saved. Thank you!' : 'Heart removed.');
    } catch (error) {
      if (!alive.current || sequence.current !== current || error.name === 'AbortError') return;
      latest.current = previous;
      setSnapshot(previous);
      setMessage('That heart didn’t save. Please try again.');
    } finally {
      if (alive.current && sequence.current === current) {
        busy.current = false;
        request.current = null;
        setPhase('ready');
      }
    }
  };

  const status = phase === 'loading' ? 'Counting the love…'
    : phase === 'saving' ? 'Saving your heart…'
      : phase === 'unavailable' ? 'Hearts are taking a little break.'
        : message || (snapshot.liked ? 'Thanks for leaving a little love.' : 'Leave a little love. No sign-in.');

  return <div className="footer-hearts" data-state={phase}>
    <div className="footer-hearts__copy">
      <p>Loved what you <strong>see?</strong></p>
      <span className="footer-hearts__status" role="status" aria-live="polite">{status}</span>
    </div>
    <PulseHeart liked={snapshot.liked} count={snapshot.count ?? 0} showCount={snapshot.count !== null}
      onChange={changeHeart} disabled={phase !== 'ready'} size={25} corner={14}
      likedColor="var(--coral, #d98d83)" idleColor="var(--brand-accent, #d8b97c)"
      pillColor="#24252e" textColor="#f2e9d6"
      label={snapshot.liked ? 'Remove your heart' : 'Give this page a heart'} />
    {config.configured && phase !== 'loading' && phase !== 'saving' && (phase === 'error' || message.startsWith('Couldn’t refresh')) &&
      <button type="button" className="footer-hearts__retry" onClick={() => refresh()}>Retry</button>}
  </div>;
}
// END OF FILE: HEARTS-PAGES-R1 | FooterHearts.jsx
