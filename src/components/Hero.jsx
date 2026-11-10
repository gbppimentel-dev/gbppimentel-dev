// Shared hero slides, stable two-line skills, and the systems approach panel.
import { useEffect, useRef, useState } from 'react';
import MorphNumber from './MorphNumber';
import SocialLinks from './SocialLinks';
import TerminalText from './TerminalText';
import TechText from './TechText';
import SlideTwoText from './SlideTwoText';
import HeroWorkbench from './HeroWorkbench';
import HeroSystems from './HeroSystems';
import HeroAction from './HeroAction';
import HeroScrollCue from './HeroScrollCue';
import HeroBackdrop from './HeroBackdrop';
import { HeroWindowBar, HeroWindowFooter } from './HeroWindowChrome';
import { projects } from '../data';
import { HERO_SLIDE_DELAY, isHeroCovered, useHeroPlayback } from '../utils/heroPlayback';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Parallax, A11y, Keyboard } from 'swiper/modules';
import { asset, mobileAsset } from '../utils/assets';
import '../styles/ScrollEffects.css';
import '../styles/SlideThree.css';
import '../styles/HeroPrint.css';
import { AnimationActivityContext, useAnimationPreferences } from '../hooks/useAnimationActivity';

function Background({ number }) {
  const source = `images/slide0${number}.png`;
  return <picture className="slide-art" data-swiper-parallax="-18%" aria-hidden="true">
    <source media="(max-width: 767px)" srcSet={mobileAsset(source)} />
    <img src={asset(source)} alt="" fetchPriority={number === 1 ? 'high' : 'low'} loading={number === 1 ? 'eager' : 'lazy'} decoding="async" />
  </picture>;
}

// Static textures avoid full-screen pointer paint; Swiper and the text effects
// keep sole ownership of the slide and copy transforms.
function HeroPlayground({ number }) {
  return <div className={'hero-playground hero-playground-' + number} aria-hidden="true">
    <div className="hero-play-halo" /><div className="hero-play-dots" />
  </div>;
}
function PrintDetails({ number }) {
  return <div className="hero-print-details" aria-hidden="true"><span className="hero-print-detail-mark">✦</span><span>gbppimentel-dev</span><span className="hero-print-detail-rule" /><span>{'0' + number + ' / 03'}</span></div>;
}

const INTERLEAVE_OFFSET = 0.5;
const HERO_TRANSITION_EASE = 'cubic-bezier(.42, 0, .58, 1)';

function interleaveSlides(swiper) {
  const offset = swiper.width * INTERLEAVE_OFFSET;
  swiper.slides.forEach(slide => {
    const inner = slide.querySelector('.slide-inner');
    if (inner) inner.style.transform = 'translate3d(' + (slide.progress * offset) + 'px, 0, 0)';
  });
}

function clearInterleaveTransition(swiper) {
  swiper.slides.forEach(slide => {
    slide.style.transition = '';
    const inner = slide.querySelector('.slide-inner');
    if (inner) inner.style.transition = '';
  });
}

function setInterleaveTransition(swiper, duration) {
  if (swiper.wrapperEl) swiper.wrapperEl.style.transitionTimingFunction = HERO_TRANSITION_EASE;
  swiper.slides.forEach(slide => {
    slide.style.transition = 'transform ' + duration + 'ms ' + HERO_TRANSITION_EASE;
    const inner = slide.querySelector('.slide-inner');
    if (inner) inner.style.transition = 'transform ' + duration + 'ms ' + HERO_TRANSITION_EASE;
  });
}

function CarouselControl({ direction, label }) {
  return <button type="button" className={'hero-carousel-control hero-' + direction} aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}>
    <span className="hero-carousel-window" aria-hidden="true"><span className="hero-carousel-track">
      <span className="hero-carousel-face">{label}</span><span className="hero-carousel-face">{label}</span>
    </span></span></button>;
}

export default function Hero({ onActiveSlideChange, onCoveredChange, suspended = false }) {
  const { player, progressRef, reduced, paused } = useHeroPlayback();
  const headerRef = useRef(null);
  const swiperRef = useRef(null);
  const { coarsePointer } = useAnimationPreferences();
  const [covered, setCovered] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed) return;
    if (covered || suspended) swiper.keyboard?.disable();
    else swiper.keyboard?.enable();
  }, [covered, suspended]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = headerRef.current;
      const navigationBottom = document.querySelector('.site-navbar')?.getBoundingClientRect().bottom ?? 0;
      const scrollInset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const overlay = document.getElementById('about') ?? document.querySelector('.landing-main');
      const next = isHeroCovered({
        fixed: Boolean(hero && getComputedStyle(hero).position === 'fixed'),
        heroBottom: hero?.getBoundingClientRect().bottom,
        overlayTop: overlay?.getBoundingClientRect().top,
        headerInset: Math.max(0, scrollInset, navigationBottom + 16),
      });
      setCovered(next);
      onCoveredChange?.(next);
      player.setHold('offscreen', next || suspended);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      player.setHold('offscreen', false);
    };
  }, [player, suspended, onCoveredChange]);


  return <AnimationActivityContext.Provider value={!covered && !suspended}><header ref={headerRef} id="home" className="header hero-print" aria-label="Introduction" data-covered={covered || suspended}>
      <SocialLinks className="hero-socials" />
      <Swiper className="swiper-container"
        modules={[Navigation, Autoplay, Parallax, A11y, Keyboard]}
        onSwiper={instance => { swiperRef.current = instance; if (covered || suspended) instance.keyboard?.disable(); player.bind(instance); setSlide(instance.realIndex); onActiveSlideChange?.(instance.realIndex); }}
        onRealIndexChange={instance => { player.reset(instance); setSlide(instance.realIndex); onActiveSlideChange?.(instance.realIndex); }}
        onAutoplayTimeLeft={player.timeLeft}
        loop speed={reduced ? 0 : coarsePointer ? 650 : 1250} parallax={!reduced && !coarsePointer} grabCursor
        autoplay={{ enabled: !reduced, delay: HERO_SLIDE_DELAY, disableOnInteraction: false, pauseOnMouseEnter: false }}
        navigation={{ nextEl: '.hero-next', prevEl: '.hero-prev', addIcons: false }}
        keyboard={{ enabled: !covered && !suspended, onlyInViewport: true }}
        onProgress={interleaveSlides}
        onTouchStart={clearInterleaveTransition}
        onSetTransition={setInterleaveTransition}
        onInit={instance => { instance.slides.forEach((item, index) => { item.inert = index !== instance.activeIndex; }); }}
        onSlideChange={instance => { instance.slides.forEach((item, index) => { item.inert = index !== instance.activeIndex; }); }}
        onSlideChangeTransitionEnd={instance => { instance.slides.forEach((item, index) => { item.inert = index !== instance.activeIndex; }); }}>
        <SwiperSlide><div className="slide-inner slide-one">
            <Background number={1} />
            <HeroPlayground number={1} />
            <HeroBackdrop number={1} />
            <div className="container hero-copy">
              <div className="hero-print-title-sheet">
              <HeroWindowBar file="profile.jsx" language="React" />
              <div className="hero-print-title-body">
              <h1 className="brand-heading" data-swiper-parallax="-300"><TechText text="gbppimentel-dev." suffix="-dev." /></h1>
              <p className="hero-byline" data-swiper-parallax="-150">by <em>Glenn Bernard Pimentel</em></p>
              </div>
              </div>
              <div className="hero-console">
              <HeroWindowBar file="jshell" language="Java" />
              <p className="hero-code hero-terminal" data-swiper-parallax="-200"><span className="hero-terminal-accessible">{'System.out.println("software engineer, UI/UX, business consultant" );'}</span><TerminalText reduced={reduced}>
                <span className="syntax-amber">System</span>.<span className="syntax-coral">out</span>.<span className="syntax-blue">println</span><span className="syntax-amber">{'('}</span><wbr />
                <em className="hero-code-roles"><span className="syntax-amber">{'"'}</span><span className="syntax-coral">software engineer</span><span className="syntax-coral">, </span><span className="syntax-lilac hero-code-uiux">UI/UX</span><span className="syntax-lilac">, </span><span className="hero-code-ending"><span className="syntax-blue">business consultant</span><span className="syntax-amber">{'"'}</span><span className="syntax-amber hero-code-close">{' );'}</span></span></em></TerminalText>
              </p>
              <div className="hero-console-output"><span aria-hidden="true">✓</span><span>React · JavaScript · HTML / CSS</span></div>
              <div className="hero-panel-actions">
                <div className="hero-footer-detail hero-resume-detail">
                  <svg className="hero-footer-file" viewBox="0 0 28 32" aria-hidden="true" focusable="false"><path d="M17 2H5a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10Z" /><path d="M17 2v8h8M8 17h12M8 22h8" /></svg>
                  <span><strong>résumé<span>.pdf</span></strong><small>Skills &amp; experience</small></span>
                </div>
                <HeroAction href={asset('Pimentel-Resume-IT.pdf')} label="View resume" hoverLabel="Open PDF" ariaLabel="View resume (PDF, opens in a new tab)" external />
              </div>
              </div>
              <PrintDetails number={1} />
            </div>
          </div></SwiperSlide>
        <SwiperSlide><div className="slide-inner slide-two">
            <Background number={2} />
            <HeroPlayground number={2} />
            <HeroBackdrop number={2} />
            <div className="container hero-copy">
              <HeroWorkbench>
              <HeroWindowBar file="skills.config" language="design + code" />
              <SlideTwoText reduced={reduced} />
              <HeroWindowFooter label="Toolkit" skills={['React', 'UI / UX']}><HeroAction href="#about" label="About me" hoverLabel="Behind the work" ariaLabel="About Glenn Bernard Pimentel" /></HeroWindowFooter>
              </HeroWorkbench>
              <PrintDetails number={2} />
            </div>
          </div></SwiperSlide>
        <SwiperSlide><div className="slide-inner slide-three">
            <Background number={3} />
            <HeroPlayground number={3} />
            <HeroBackdrop number={3} />
            <div className="container hero-copy hero-copy-three">
              <div className="hero-three-parallax-shell" data-swiper-parallax="-220">
              <div className="hero-three-frame">
              <HeroWindowBar file="approach.md" language="NetSuite / ERP" />
              <HeroSystems reduced={reduced} />
              <div className="hero-panel-actions">
                <div className="hero-footer-detail hero-project-detail">
                  <span className="hero-project-count" aria-hidden="true">{String(projects.length).padStart(2, '0')}</span>
                  <span><strong>{projects.length} case {projects.length === 1 ? 'study' : 'studies'}</strong><small>Web &amp; mobile</small></span>
                </div>
                <HeroAction href="#projects" label="Explore projects" hoverLabel="Take a look" ariaLabel="Explore projects" />
              </div>
              </div>
              </div>
              <PrintDetails number={3} />
            </div>
          </div></SwiperSlide>
        <div slot="container-end" className="hero-carousel-nav" role="group" aria-label="Slide controls">
          <CarouselControl direction="prev" label="PREV" />
          <button type="button" className="hero-carousel-toggle" data-paused={paused} onClick={player.toggle} aria-label={paused ? 'Play slides' : 'Pause slides'}>
            <svg className="hero-toggle-play" viewBox="0 0 384 512" aria-hidden="true" focusable="false"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" /></svg>
            <svg className="hero-toggle-pause" viewBox="0 0 320 512" aria-hidden="true" focusable="false"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z" /></svg>
          </button>
          <CarouselControl direction="next" label="NEXT" />
        </div>
        <div slot="container-end" className="hero-corner"><HeroScrollCue /><div className="hero-pagination" role="img" aria-label={'Slide ' + (slide + 1) + ' of 3'}><span aria-hidden="true"><MorphNumber value={slide + 1} /><span className="hero-pagination-total"> / 3</span></span></div></div>
      </Swiper>
      {!reduced && <div className="hero-slide-timer" aria-hidden="true"><span ref={progressRef} className="hero-slide-timer-fill" /></div>}
    </header></AnimationActivityContext.Provider>;
}
// END OF FILE: PORTFOLIO-SALT-LIGHT-R6 | Hero.jsx
