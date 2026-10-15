// CHANGE VERSION: PORTFOLIO-POLISH-R17 | 2026-10-15 | Complete Hero.jsx
import { useState } from 'react';
import MorphNumber from './MorphNumber';
import SocialLinks from './SocialLinks';
import TerminalText from './TerminalText';
import TechText from './TechText';
import SlideTwoText from './SlideTwoText';
import DecryptedText from './DecryptedText';
import BlurText from './BlurText';
import { HERO_SLIDE_DELAY, useHeroPlayback } from '../utils/heroPlayback';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Parallax, A11y, Keyboard } from 'swiper/modules';
import { asset } from '../utils/assets';
import '../styles/ScrollEffects.css';
import '../styles/SlideThree.css';

function Background({ number }) {
  return <div className="slide-art" data-swiper-parallax="-18%" aria-hidden="true" style={{ backgroundImage: 'url(' + asset('images/slide0' + number + '.png') + ')' }} />;
}

const INTERLEAVE_OFFSET = 0.5;
const HERO_TRANSITION_EASE = 'cubic-bezier(.42, 0, .58, 1)';
const slideThreeErp = 'ERP,';
const slideThreeConnected = 'connected.';
const slideThreeDecryptPalette = ['var(--amber)', 'var(--blue)', 'var(--lilac)', 'var(--sage)'];
const slideThreeDecryptCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_/%*#$@!~[]{}<>+-=';

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

export default function Hero({ onActiveSlideChange }) {
  const { player, progressRef, reduced, paused } = useHeroPlayback();
  const [slide, setSlide] = useState(0);
  const [slideThreeVisit, setSlideThreeVisit] = useState(0);

  return <header id="home" className="header" aria-label="Introduction">
      <SocialLinks className="hero-socials" />
      <Swiper className="swiper-container"
        modules={[Navigation, Autoplay, Parallax, A11y, Keyboard]}
        onSwiper={instance => { player.bind(instance); setSlide(instance.realIndex); if (instance.realIndex === 2) setSlideThreeVisit(1); onActiveSlideChange?.(instance.realIndex); }}
        onRealIndexChange={instance => { player.reset(instance); setSlide(instance.realIndex); if (instance.realIndex === 2) setSlideThreeVisit(value => value + 1); onActiveSlideChange?.(instance.realIndex); }}
        onAutoplayTimeLeft={player.timeLeft}
        loop speed={reduced ? 0 : 1250} parallax={!reduced} grabCursor
        autoplay={{ enabled: true, delay: HERO_SLIDE_DELAY, disableOnInteraction: false, pauseOnMouseEnter: false }}
        navigation={{ nextEl: '.hero-next', prevEl: '.hero-prev', addIcons: false }}
        keyboard={{ enabled: true, onlyInViewport: true }}
        onProgress={interleaveSlides}
        onTouchStart={clearInterleaveTransition}
        onSetTransition={setInterleaveTransition}
        onInit={instance => { instance.slides.forEach((item, index) => { item.inert = index !== instance.activeIndex; }); }}
        onSlideChange={instance => { instance.slides.forEach((item, index) => { item.inert = index !== instance.activeIndex; }); }}
        onSlideChangeTransitionEnd={instance => { instance.slides.forEach((item, index) => { item.inert = index !== instance.activeIndex; }); }}>
        <SwiperSlide><div className="slide-inner slide-one">
            <Background number={1} />
            <div className="container hero-copy">
              <p className="hero-eyebrow" data-swiper-parallax="-100">DEVELOPMENT + DESIGN + ERP SOLUTIONS</p>
              <h1 className="brand-heading" data-swiper-parallax="-300"><TechText text="gbppimentel-dev." suffix="-dev." /></h1>
              <p className="hero-byline" data-swiper-parallax="-150">by <em>Glenn Bernard Pimentel</em></p>
              <p className="hero-code hero-terminal" data-swiper-parallax="-200"><span className="hero-terminal-accessible">{'System.out.println("software engineer, UI/UX, business consultant" );'}</span><TerminalText reduced={reduced}>
                <span className="syntax-amber">System</span>.<span className="syntax-coral">out</span>.<span className="syntax-blue">println</span><span className="syntax-amber">{'('}</span><wbr />
                <em className="hero-code-roles"><span className="syntax-amber">{'"'}</span><span className="syntax-coral">software engineer</span><span className="syntax-coral">, </span><span className="syntax-lilac hero-code-uiux">UI/UX</span><span className="syntax-lilac">, </span><span className="hero-code-ending"><span className="syntax-blue">business consultant</span><span className="syntax-amber">{'"'}</span><span className="syntax-amber hero-code-close">{' );'}</span></span></em></TerminalText>
              </p>
              <a href={asset('Pimentel-Resume-IT.pdf')} target="_blank" rel="noopener noreferrer" className="hero-resume" aria-label="View resume (PDF, opens in a new tab)"><span className="hero-resume-face hero-resume-rest" aria-hidden="true"><span className="hero-resume-label">VIEW RESUME</span></span><span className="hero-resume-face hero-resume-hover" aria-hidden="true"><svg className="hero-resume-icon" viewBox="0 0 20 20" focusable="false"><path d="M11 3h6v6M17 3 9 11" /><path d="M15 11v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></svg><span className="hero-resume-label">OPEN PDF</span></span></a>
            </div>
          </div></SwiperSlide>
        <SwiperSlide><div className="slide-inner slide-two">
            <Background number={2} />
            <div className="container hero-copy">
              <p className="hero-eyebrow" data-swiper-parallax="-100">Code meets creativity.</p>
              <SlideTwoText reduced={reduced} />
            </div>
          </div></SwiperSlide>
        <SwiperSlide><div className="slide-inner slide-three">
            <Background number={3} />
            <div className="container hero-copy hero-copy-three">
              <p className="hero-eyebrow" data-swiper-parallax="-100">Built for business.</p>
              <div className="hero-three-code" data-swiper-parallax="-220" role="group" aria-label="Design and development for connected ERP solutions">
                <span className="hero-three-brace hero-three-brace-open" aria-hidden="true">{'{'}</span>
                <code className="hero-three-code-text">
                  <span className="hero-three-line hero-three-line-primary">
                    {reduced ? <>
                      <span className="hero-three-think-word">think</span>{' '}
                      <span className="hero-three-plus" aria-hidden="true">+</span>{' '}
                      <span className="hero-three-build-word">BUILD_</span>
                    </> : <>
                      <DecryptedText text="think" speed={145} sequential revealDirection="center" characters={slideThreeDecryptCharacters} encryptedPalette={slideThreeDecryptPalette} className="hero-decrypted-char" parentClassName="hero-three-decrypted hero-three-decrypted-inline hero-three-think-word" encryptedClassName="hero-decrypted-encrypted" animateOn="manual" replayKey={slide === 2 ? slideThreeVisit : null} startDelay={0} />{' '}
                      <span className="hero-three-plus" aria-hidden="true">+</span>{' '}
                      <DecryptedText text="BUILD_" speed={145} sequential revealDirection="center" characters={slideThreeDecryptCharacters} encryptedPalette={slideThreeDecryptPalette} className="hero-decrypted-char" parentClassName="hero-three-decrypted hero-three-decrypted-inline hero-three-build-word" encryptedClassName="hero-decrypted-encrypted" animateOn="manual" replayKey={slide === 2 ? slideThreeVisit : null} startDelay={360} />
                    </>}
                  </span>
                  <span className="hero-three-line hero-three-line-accent">
                    {reduced ? (
                      <><span className="hero-three-erp">ERP,</span>{' '}<span className="hero-three-connected">connected.</span></>
                    ) : (
                      <>
                        <DecryptedText text={slideThreeErp} speed={145} sequential revealDirection="center" characters={slideThreeDecryptCharacters} encryptedPalette={slideThreeDecryptPalette} className="hero-decrypted-char" parentClassName="hero-three-decrypted hero-three-decrypted-inline hero-three-erp" encryptedClassName="hero-decrypted-encrypted" animateOn="manual" replayKey={slide === 2 ? slideThreeVisit : null} startDelay={1150} />{' '}
                        <DecryptedText text={slideThreeConnected} speed={145} sequential revealDirection="center" characters={slideThreeDecryptCharacters} encryptedPalette={slideThreeDecryptPalette} className="hero-decrypted-char" parentClassName="hero-three-decrypted hero-three-decrypted-inline hero-three-connected" encryptedClassName="hero-decrypted-encrypted" animateOn="manual" replayKey={slide === 2 ? slideThreeVisit : null} startDelay={1550} />
                      </>
                    )}
                    <span className="hero-three-brace hero-three-brace-close" aria-hidden="true">{'}'}</span>
                  </span>
                </code>
              </div>
              <BlurText key={slideThreeVisit} active={slide === 2} text="from concept → business impact." className="hero-three-byline" />
              <div className="hero-three-actions" data-swiper-parallax="-100">
                <a href="#projects" className="hero-resume hero-project-cta" aria-label="Explore projects">
                  <span className="hero-resume-face hero-resume-rest" aria-hidden="true">
                    <svg className="hero-resume-icon" viewBox="0 0 20 20" focusable="false"><path d="M3.5 10h12M10 4.5l5.5 5.5-5.5 5.5" /></svg>
                    <span className="hero-resume-label">EXPLORE PORTFOLIO</span>
                  </span>
                  <span className="hero-resume-face hero-resume-hover" aria-hidden="true">
                    <svg className="hero-resume-icon" viewBox="0 0 20 20" focusable="false"><circle cx="8.5" cy="8.5" r="5" /><path d="m12.2 12.2 4.3 4.3" /></svg>
                    <span className="hero-resume-label">TAKE A LOOK!</span>
                  </span>
                </a>
              </div>
            </div>
          </div></SwiperSlide>
        <div slot="container-end" className="hero-carousel-nav" role="group" aria-label="Slide controls">
          <CarouselControl direction="prev" label="PREV" />
          <button type="button" className="hero-carousel-toggle" data-paused={paused} onClick={player.toggle} aria-label={paused ? 'Play slides' : 'Pause slides'} title={paused ? 'Play slides' : 'Pause slides'}>
            <svg className="hero-toggle-play" viewBox="0 0 384 512" aria-hidden="true" focusable="false"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" /></svg>
            <svg className="hero-toggle-pause" viewBox="0 0 320 512" aria-hidden="true" focusable="false"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z" /></svg>
          </button>
          <CarouselControl direction="next" label="NEXT" />
        </div>
        <div slot="container-end" className="hero-corner"><a href="#about" className="hero-scroll-mouse" aria-label="Scroll down to About me"><span className="scrolldown" aria-hidden="true"><span className="chevrons"><span className="chevrondown" /><span className="chevrondown" /></span></span></a><div className="hero-pagination" role="img" aria-label={'Slide ' + (slide + 1) + ' of 3'}><span aria-hidden="true"><MorphNumber value={slide + 1} /><span className="hero-pagination-total"> / 3</span></span></div></div>
      </Swiper>
      {!reduced && <div className="hero-slide-timer" aria-hidden="true"><span ref={progressRef} className="hero-slide-timer-fill" /></div>}
    </header>;
}
// END OF FILE: PORTFOLIO-POLISH-R17 | Hero.jsx
