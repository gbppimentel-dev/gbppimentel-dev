import { useRef } from 'react';
import { useSwiperSlide } from 'swiper/react';
import useAnimationActivity from '../hooks/useAnimationActivity';

const description = 'NetSuite support, clearer workflows, and software built around real tasks.';
const descriptionWords = description.split(' ');

function RevealWord({ children, delay, emphasis = false }) {
  const word = <span className="hero-systems-word-mask">
    <span className="hero-systems-word" style={{ '--word-delay': `${delay}ms` }}>{children}</span>
  </span>;
  return emphasis ? <em>{word}</em> : word;
}

export default function HeroSystems({ reduced = false }) {
  const root = useRef(null);
  const isActive = useSwiperSlide()?.isActive ?? false;
  const activity = useAnimationActivity(root, { enabled: isActive });
  return <div ref={root} className="hero-systems" data-reveal={activity.active && !reduced}>
    <p className="hero-systems-comment"><span aria-hidden="true">//</span> A practical approach to technology</p>
    <h2 className="hero-systems-title" aria-label="Make systems make sense.">
      <span className="hero-systems-source-line" aria-hidden="true"><span className="hero-systems-line-number">01</span><span><RevealWord delay={120}>Make</RevealWord>{' '}<RevealWord delay={300}>systems</RevealWord></span></span>
      <span className="hero-systems-source-line" aria-hidden="true"><span className="hero-systems-line-number">02</span><span><RevealWord delay={440}>make</RevealWord>{' '}<RevealWord delay={620} emphasis>sense.</RevealWord></span></span>
    </h2>
    <p className="hero-systems-description">{descriptionWords.map((word, index) => <span key={word + index}>
      <span className="hero-systems-description-word" style={{ '--word-delay': `${620 + index * 35}ms` }}>{word}</span>{index < descriptionWords.length - 1 ? ' ' : ''}
    </span>)}</p>
  </div>;
}
