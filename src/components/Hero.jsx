import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Parallax, A11y, Keyboard } from 'swiper/modules';
import { socialLinks } from '../data';
import { asset } from '../utils/assets';

function Background({ number }) {
  return <div className="slide-art" data-swiper-parallax="-18%" aria-hidden="true"
    style={{ backgroundImage: `url(${asset(`images/slide0${number}.png`)})` }} />;
}

export default function Hero() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const swiper = useRef(null);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!swiper.current || swiper.current.destroyed) return;
    if (reduced || paused || focused || hovered) swiper.current.autoplay.stop();
    else swiper.current.autoplay.start();
  }, [reduced, paused, focused, hovered]);

  return (
    <header id="home" className="header" aria-label="Introduction"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <ul className="social-media">
        {socialLinks.map(({ name, href }) => <li key={name}><a href={href}>{name}</a></li>)}
      </ul>
      <Swiper className="swiper-container"
        modules={[Navigation, Pagination, Autoplay, Parallax, A11y, Keyboard]}
        onSwiper={instance => { swiper.current = instance; if (reduced) instance.autoplay.stop(); }}
        loop speed={reduced ? 0 : 1000} parallax={!reduced} grabCursor
        autoplay={reduced ? false : { delay: 5500, disableOnInteraction: false }}
        navigation={{ nextEl: '.hero-next', prevEl: '.hero-prev', addIcons: false }}
        pagination={{ type: 'fraction' }} keyboard={{ enabled: true, onlyInViewport: true }}
        onInit={instance => { instance.slides.forEach((slide, index) => { slide.inert = index !== instance.activeIndex; }); }}
        onSlideChange={instance => {
          // Inactive slide links must not be part of the keyboard tab order.
          instance.slides.forEach((slide, index) => { slide.inert = index !== instance.activeIndex; });
        }}
        onSlideChangeTransitionEnd={instance => {
          instance.slides.forEach((slide, index) => { slide.inert = index !== instance.activeIndex; });
        }}>
        <SwiperSlide>
          <div className="slide-inner slide-one">
            <Background number={1} />
            <div className="container hero-copy">
              <p className="hero-eyebrow" data-swiper-parallax="-100">development + design</p>
              <h1 className="brand-heading" data-swiper-parallax="-300"><span className="brand-handle">gbppimentel</span><wbr /><span className="brand-dev">-dev</span></h1>
              <p className="hero-byline" data-swiper-parallax="-150">by Glenn Bernard Pimentel</p>
              <p className="hero-code" data-swiper-parallax="-200">
                <span className="syntax-amber">System</span>.<span className="syntax-coral">out</span>.<span className="syntax-blue">println</span><span className="syntax-amber">{'("'}</span><wbr />
                <span className="syntax-coral">software engineer, </span><span className="syntax-lilac">UI/UX</span><span className="syntax-amber">{'");'}</span>
              </p>
              <a href={asset('Pimentel-Resume-IT.pdf')} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <span data-hover="OPEN MY PDF">VIEW RESUME</span>
              </a>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-inner slide-two">
            <Background number={2} />
            <div className="container hero-copy">
              <p className="hero-eyebrow" data-swiper-parallax="-100">Code meets creativity.</p>
              <p className="hero-design-line" data-swiper-parallax="-200">/$graphic design &amp;</p>
              <h2 data-swiper-parallax="-300">.web development&gt;</h2>
              <a href="#about" className="btn-ghost"><span data-hover="GET TO KNOW ME">ABOUT ME</span></a>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-inner slide-three">
            <Background number={3} />
            <div className="container hero-copy">
              <p className="hero-eyebrow" data-swiper-parallax="-100">From the first idea to the final detail.</p>
              <p className="hero-design-line" data-swiper-parallax="-300"><span className="code-bracket">{'{'}</span> interactive frontend</p>
              <h2 data-swiper-parallax="-200">seamless backend<span className="code-bracket">{'}'}</span></h2>
              <a href="#projects" className="btn-ghost"><span data-hover="TAKE A LOOK">EXPLORE PROJECTS</span></a>
            </div>
          </div>
        </SwiperSlide>
        <button type="button" className="swiper-button-prev hero-prev" aria-label="Previous slide"><span data-hover="PREV">PREV</span></button>
        <button type="button" className="swiper-button-next hero-next" aria-label="Next slide"><span data-hover="NEXT">NEXT</span></button>
      </Swiper>
      {!reduced && <button className="hero-pause" type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>
        {paused ? '▶ Play slides' : 'Ⅱ Pause slides'}
      </button>}
      <a href="#about" className="hero-scroll">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
    </header>
  );
}
