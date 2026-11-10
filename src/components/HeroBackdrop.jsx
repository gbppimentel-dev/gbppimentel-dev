import { useRef } from 'react';
import { useSwiperSlide } from 'swiper/react';
import useAnimationActivity from '../hooks/useAnimationActivity';
import '../styles/hero-backdrop.css';

// A quiet optical field belongs to the background, without labels or objects.
export default function HeroBackdrop({ number }) {
  const surface = useRef(null);
  const slide = useSwiperSlide();
  const { active } = useAnimationActivity(surface, { enabled: slide?.isActive ?? true, threshold: .08 });
  return <div ref={surface} className={`hero-backdrop hero-backdrop--${number}`} data-active={active} aria-hidden="true">
    <div className="hero-backdrop-contours"><svg className="hero-backdrop-mesh" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none" focusable="false">
      {Array.from({ length: 18 }, (_, index) => {
        const y = index * 53 - 10;
        const bend = number === 2 ? 140 : number === 3 ? -115 : 90;
        return <path key={index} d={`M-100 ${y}C260 ${y-bend} 480 ${y+bend*1.6} 760 ${y+40}S1210 ${y-bend} 1540 ${y+50}`} />;
      })}
    </svg></div>
    <div className="hero-backdrop-sheen" />
    <div className="hero-backdrop-grain" />
  </div>;
}
