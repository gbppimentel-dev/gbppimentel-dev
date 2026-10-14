// CHANGE VERSION: CAROUSEL-R3 | 2026-10-14 | Complete Hero.jsx
import { HERO_SLIDE_DELAY, useHeroPlayback } from '../utils/heroPlayback';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Parallax, A11y, Keyboard } from 'swiper/modules';
import { socialLinks } from '../data';
import { asset } from '../utils/assets';
function Background({ number }) {
  return <div className="slide-art" data-swiper-parallax="-18%" aria-hidden="true" style={{ backgroundImage: `url(${asset(`images/slide0${number}.png`)})` }} />;
}
function CarouselControl({ direction, label }) {
  return <button type="button" className={`hero-carousel-control hero-${direction}`} aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}>
    <span className="hero-carousel-window" aria-hidden="true"><span className="hero-carousel-track">
      <span className="hero-carousel-face">{label}</span><span className="hero-carousel-face">{label}</span>
    </span></span></button>;
}
export default function Hero({ onActiveSlideChange }) {
  const { player, progressRef, reduced, paused } = useHeroPlayback();
  return <header id="home" className="header" aria-label="Introduction"
      onFocusCapture={() => player.setHold('focus', true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) player.setHold('focus', false); }}
      onMouseEnter={() => player.setHold('hover', true)} onMouseLeave={() => player.setHold('hover', false)}>
      <ul className="social-media">{socialLinks.map(({ name, href }) => <li key={name}><a href={href}>{name}</a></li>)}</ul>
      <Swiper className="swiper-container"
        modules={[Navigation, Pagination, Autoplay, Parallax, A11y, Keyboard]}
        onSwiper={instance => { player.bind(instance); onActiveSlideChange?.(instance.realIndex); }}
        onRealIndexChange={instance => { player.reset(instance); onActiveSlideChange?.(instance.realIndex); }}
        onAutoplayTimeLeft={player.timeLeft}
        loop speed={reduced ? 0 : 1000} parallax={!reduced} grabCursor
        autoplay={{ enabled: !reduced, delay: HERO_SLIDE_DELAY, disableOnInteraction: false }}
        navigation={{ nextEl: '.hero-next', prevEl: '.hero-prev', addIcons: false }}
        pagination={{ type: 'fraction' }} keyboard={{ enabled: true, onlyInViewport: true }}
        onInit={instance => { instance.slides.forEach((slide, index) => { slide.inert = index !== instance.activeIndex; }); }}
        onSlideChange={instance => { instance.slides.forEach((slide, index) => { slide.inert = index !== instance.activeIndex; }); }}
        onSlideChangeTransitionEnd={instance => { instance.slides.forEach((slide, index) => { slide.inert = index !== instance.activeIndex; }); }}>
        <SwiperSlide><div className="slide-inner slide-one">
            <Background number={1} />
            <div className="container hero-copy">
              <p className="hero-eyebrow" data-swiper-parallax="-100">development + design</p>
              <h1 className="brand-heading" data-swiper-parallax="-300"><span className="brand-handle">gbppimentel</span><wbr /><span className="brand-dev">-dev</span></h1>
              <p className="hero-byline" data-swiper-parallax="-150">by Glenn Bernard Pimentel</p>
              <p className="hero-code" data-swiper-parallax="-200">
                <span className="syntax-amber">System</span>.<span className="syntax-coral">out</span>.<span className="syntax-blue">println</span><span className="syntax-amber">{'("'}</span><wbr />
                <span className="syntax-coral">software engineer, </span><span className="syntax-lilac">UI/UX</span><span className="syntax-amber">{'");'}</span>
              </p>
              <a href={asset('Pimentel-Resume-IT.pdf')} target="_blank" rel="noopener noreferrer" className="btn-ghost"><span data-hover="OPEN MY PDF">VIEW RESUME</span></a>
            </div>
          </div></SwiperSlide>
        <SwiperSlide><div className="slide-inner slide-two">
            <Background number={2} />
            <div className="container hero-copy">
              <p className="hero-eyebrow" data-swiper-parallax="-100">Code meets creativity.</p>
              <p className="hero-design-line" data-swiper-parallax="-200">/$graphic design &amp;</p>
              <h2 data-swiper-parallax="-300">.web development&gt;</h2>
              <a href="#about" className="btn-ghost"><span data-hover="GET TO KNOW ME">ABOUT ME</span></a>
            </div>
          </div></SwiperSlide>
        <SwiperSlide><div className="slide-inner slide-three">
            <Background number={3} />
            <div className="container hero-copy">
              <p className="hero-eyebrow" data-swiper-parallax="-100">From the first idea to the final detail.</p>
              <p className="hero-design-line" data-swiper-parallax="-300"><span className="code-bracket">{'{'}</span> interactive frontend</p>
              <h2 data-swiper-parallax="-200">seamless backend<span className="code-bracket">{'}'}</span></h2>
              <a href="#projects" className="btn-ghost"><span data-hover="TAKE A LOOK">EXPLORE PROJECTS</span></a>
            </div>
          </div></SwiperSlide>
        <div slot="container-end" className="hero-carousel-nav" role="group" aria-label="Slide controls">
          <CarouselControl direction="prev" label="PREV" />
          {!reduced && <button type="button" className="hero-carousel-toggle" data-paused={paused} onClick={player.toggle} aria-label={paused ? 'Play slides' : 'Pause slides'} title={paused ? 'Play slides' : 'Pause slides'}>
            <svg className="hero-toggle-play" viewBox="0 0 384 512" aria-hidden="true" focusable="false"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" /></svg>
            <svg className="hero-toggle-pause" viewBox="0 0 320 512" aria-hidden="true" focusable="false"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z" /></svg>
          </button>}
          <CarouselControl direction="next" label="NEXT" />
        </div>
      </Swiper>
      {!reduced && <div className="hero-slide-timer" aria-hidden="true"><span ref={progressRef} className="hero-slide-timer-fill" /></div>}
      <a href="#about" className="hero-scroll">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
    </header>;
}
// END OF FILE: CAROUSEL-R3 | Hero.jsx
