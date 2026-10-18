// CHANGE VERSION: HERO-PLAYGROUND-R4 | 2026-10-16 | Complete Hero.jsx
import { useEffect, useRef, useState } from 'react';
import MorphNumber from './MorphNumber';
import SocialLinks from './SocialLinks';
import TerminalText from './TerminalText';
import TechText from './TechText';
import SlideTwoText from './SlideTwoText';
import HeroWorkbench from './HeroWorkbench';
import HeroArtwork from './HeroArtwork';
import DecryptedText from './DecryptedText';
import BlurText from './BlurText';
import { HERO_SLIDE_DELAY, useHeroPlayback } from '../utils/heroPlayback';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Parallax, A11y, Keyboard } from 'swiper/modules';
import { asset } from '../utils/assets';
import '../styles/ScrollEffects.css';
import '../styles/SlideThree.css';
import '../styles/HeroPrint.css';

function Background({ number }) {
  return <div className="slide-art" data-swiper-parallax="-18%" aria-hidden="true" style={{ backgroundImage: 'url(' + asset('images/slide0' + number + '.png') + ')' }} />;
}

// Only these decorative layers respond to the pointer. Swiper and the text
// effects keep sole ownership of the slide and copy transforms.
function HeroPlayground({ number }) {
  const decoration = useRef(null);
  useEffect(() => {
    const root = decoration.current;
    const header = root?.closest('header');
    if (!root || !header) return undefined;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    const paint = () => {
      x += (targetX - x) * .085;
      y += (targetY - y) * .085;
      if (Math.abs(targetX - x) + Math.abs(targetY - y) < .002) {
        x = targetX;
        y = targetY;
      }
      root.style.setProperty('--hero-play-x', x.toFixed(4));
      root.style.setProperty('--hero-play-y', y.toFixed(4));
      frame = x !== targetX || y !== targetY ? window.requestAnimationFrame(paint) : 0;
    };
    const queue = () => { if (!frame) frame = window.requestAnimationFrame(paint); };
    const reset = () => {
      if (!x && !y && !targetX && !targetY) return;
      targetX = 0;
      targetY = 0;
      queue();
    };
    const move = event => {
      if (!finePointer.matches || reducedMotion.matches) return;
      if (!root.closest('.swiper-slide')?.classList.contains('swiper-slide-active')) {
        if (x || y || targetX || targetY) reset();
        return;
      }
      const rect = header.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - .5) * 2));
      targetY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - .5) * 2));
      queue();
    };
    const preferencesChanged = () => {
      if (finePointer.matches && !reducedMotion.matches) return;
      window.cancelAnimationFrame(frame);
      frame = 0;
      x = y = targetX = targetY = 0;
      root.style.setProperty('--hero-play-x', '0');
      root.style.setProperty('--hero-play-y', '0');
    };
    header.addEventListener('pointermove', move, { passive: true });
    header.addEventListener('pointerleave', reset, { passive: true });
    finePointer.addEventListener('change', preferencesChanged);
    reducedMotion.addEventListener('change', preferencesChanged);
    return () => {
      window.cancelAnimationFrame(frame);
      header.removeEventListener('pointermove', move);
      header.removeEventListener('pointerleave', reset);
      finePointer.removeEventListener('change', preferencesChanged);
      reducedMotion.removeEventListener('change', preferencesChanged);
    };
  }, []);
  return <div ref={decoration} className={'hero-playground hero-playground-' + number} aria-hidden="true">
    <div className="hero-play-halo" />
    <div className="hero-play-dots" />
    <svg className="hero-play-registration" viewBox="0 0 1200 800" preserveAspectRatio="none" focusable="false"><path d="M35 75V35h40m1050 0h40v40M35 725v40h40m1050 0h40v-40" /><path d="M15 55h40M35 15v40m1110 0h40m-20-40v40M15 745h40m-20 0v40m1110-40h40m-20 0v40" /></svg>
    <svg className="hero-play-orbit" viewBox="0 0 600 420" focusable="false"><path d="M109 307C-34 120 414-68 532 72S248 406 165 295s212-164 231-61" /><path d="m379 222 20 15 9-23M76 151l12 9m-7-20 3 22m373-50 11 9m-7-20 3 22" /></svg>
    <HeroArtwork number={number} />
  </div>;
}

function PrintDetails({ number }) {
  return <div className="hero-print-details" aria-hidden="true"><span className="hero-print-detail-mark">✦</span><span>gbppimentel-dev</span><span className="hero-print-detail-rule" /><span>{'0' + number + ' / 03'}</span></div>;
}

// The live glyphs share a slot sized by the finished word, so scrambling never
// changes the line geometry, underline width, or the surrounding frame.
function HeroDecryptWord({ text, wordClassName, ...props }) {
  return <span className={'hero-decrypt-word ' + wordClassName}>
    <span className="hero-decrypt-slot">
      <span className="hero-decrypt-slot-sizer" aria-hidden="true">
        {Array.from(text).map((char, index) => <span key={index} className="hero-decrypted-char">{char}</span>)}
      </span>
      <DecryptedText {...props} text={text} parentClassName="hero-three-decrypted hero-three-decrypted-inline hero-decrypt-slot-live" />
    </span>
  </span>;
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

  return <header id="home" className="header hero-print" aria-label="Introduction">
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
            <HeroPlayground number={1} />
            <div className="container hero-copy">
              <p className="hero-eyebrow" data-swiper-parallax="-100">DEVELOPMENT + DESIGN + ERP SOLUTIONS</p>
              <div className="hero-print-title-sheet">
              <span className="hero-print-sheet-tag" aria-hidden="true"><span>WORK</span><svg viewBox="0 0 40 24" focusable="false"><path d="M2 12h34m-9-8 9 8-9 8" /></svg><span>IN PLAY</span></span>
              <h1 className="brand-heading" data-swiper-parallax="-300"><TechText text="gbppimentel-dev." suffix="-dev." /></h1>
              <p className="hero-byline" data-swiper-parallax="-150">by <em>Glenn Bernard Pimentel</em></p>
              <div className="hero-skill-patches" aria-hidden="true"><span><b>{'{ }'}</b> develop</span><span><b>✳</b> design</span><span><b>↗</b> connect</span></div>
              </div>
              <p className="hero-code hero-terminal" data-swiper-parallax="-200"><span className="hero-terminal-accessible">{'System.out.println("software engineer, UI/UX, business consultant" );'}</span><TerminalText reduced={reduced}>
                <span className="syntax-amber">System</span>.<span className="syntax-coral">out</span>.<span className="syntax-blue">println</span><span className="syntax-amber">{'('}</span><wbr />
                <em className="hero-code-roles"><span className="syntax-amber">{'"'}</span><span className="syntax-coral">software engineer</span><span className="syntax-coral">, </span><span className="syntax-lilac hero-code-uiux">UI/UX</span><span className="syntax-lilac">, </span><span className="hero-code-ending"><span className="syntax-blue">business consultant</span><span className="syntax-amber">{'"'}</span><span className="syntax-amber hero-code-close">{' );'}</span></span></em></TerminalText>
              </p>
              <a href={asset('Pimentel-Resume-IT.pdf')} target="_blank" rel="noopener noreferrer" className="hero-resume" aria-label="View resume (PDF, opens in a new tab)"><span className="hero-resume-face hero-resume-rest" aria-hidden="true"><span className="hero-resume-label">VIEW RESUME</span></span><span className="hero-resume-face hero-resume-hover" aria-hidden="true"><svg className="hero-resume-icon" viewBox="0 0 20 20" focusable="false"><path d="M11 3h6v6M17 3 9 11" /><path d="M15 11v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></svg><span className="hero-resume-label">OPEN PDF</span></span></a>
              <PrintDetails number={1} />
            </div>
          </div></SwiperSlide>
        <SwiperSlide><div className="slide-inner slide-two">
            <Background number={2} />
            <HeroPlayground number={2} />
            <div className="container hero-copy">
              <p className="hero-eyebrow" data-swiper-parallax="-100">Code meets creativity.</p>
              <HeroWorkbench reduced={reduced}>
              <div className="hero-workbench-top" aria-hidden="true"><span className="hero-workbench-dots"><i /><i /><i /></span><span>mode: make</span><svg viewBox="0 0 70 30" focusable="false"><path d="M4 8c18 28 43 12 43-2 0-8-15-4-8 8 6 9 18 8 26 0m-11-2 12 1-6 10" /></svg></div>
              <SlideTwoText reduced={reduced} />
              </HeroWorkbench>
              <PrintDetails number={2} />
            </div>
          </div></SwiperSlide>
        <SwiperSlide><div className="slide-inner slide-three">
            <Background number={3} />
            <HeroPlayground number={3} />
            <div className="container hero-copy hero-copy-three">
              <p className="hero-eyebrow" data-swiper-parallax="-100">Built for business.</p>
              {/* A fresh keyed frame clears positions retained by live code updates. */}
              <div key="hero-three-print-frame-r3" className="hero-three-frame" data-swiper-parallax="-220">
              <div className="hero-code-stamp" aria-hidden="true"><span>IDEA → SYSTEM</span><span className="hero-code-stamp-symbol">✦</span></div>
              <div className="hero-three-code" role="group" aria-label="Design and development for connected ERP solutions">
                <span className="hero-three-brace hero-three-brace-open" aria-hidden="true">{'{'}</span>
                <code className="hero-three-code-text">
                  <span className="hero-three-line hero-three-line-primary">
                    {reduced ? <>
                      <span className="hero-three-think-word">think</span>{' '}
                      <span className="hero-three-plus" aria-hidden="true">+</span>{' '}
                      <span className="hero-three-build-word">BUILD_</span>
                    </> : <>
                      <HeroDecryptWord text="think" speed={145} sequential revealDirection="center" characters={slideThreeDecryptCharacters} encryptedPalette={slideThreeDecryptPalette} className="hero-decrypted-char" wordClassName="hero-three-think-word" encryptedClassName="hero-decrypted-encrypted" animateOn="manual" replayKey={slide === 2 ? slideThreeVisit : null} startDelay={0} />{' '}
                      <span className="hero-three-plus" aria-hidden="true">+</span>{' '}
                      <HeroDecryptWord text="BUILD_" speed={145} sequential revealDirection="center" characters={slideThreeDecryptCharacters} encryptedPalette={slideThreeDecryptPalette} className="hero-decrypted-char" wordClassName="hero-three-build-word" encryptedClassName="hero-decrypted-encrypted" animateOn="manual" replayKey={slide === 2 ? slideThreeVisit : null} startDelay={360} />
                    </>}
                  </span>
                  <span className="hero-three-line hero-three-line-accent">
                    {reduced ? (
                      <><span className="hero-three-erp">ERP,</span>{' '}<span className="hero-three-connected">connected.</span></>
                    ) : (
                      <>
                        <HeroDecryptWord text={slideThreeErp} speed={145} sequential revealDirection="center" characters={slideThreeDecryptCharacters} encryptedPalette={slideThreeDecryptPalette} className="hero-decrypted-char" wordClassName="hero-three-erp" encryptedClassName="hero-decrypted-encrypted" animateOn="manual" replayKey={slide === 2 ? slideThreeVisit : null} startDelay={1150} />{' '}
                        <HeroDecryptWord text={slideThreeConnected} speed={145} sequential revealDirection="center" characters={slideThreeDecryptCharacters} encryptedPalette={slideThreeDecryptPalette} className="hero-decrypted-char" wordClassName="hero-three-connected" encryptedClassName="hero-decrypted-encrypted" animateOn="manual" replayKey={slide === 2 ? slideThreeVisit : null} startDelay={1550} />
                      </>
                    )}
                    <span className="hero-three-brace hero-three-brace-close" aria-hidden="true">{'}'}</span>
                  </span>
                </code>
              </div>
              </div>
              <PrintDetails number={3} />
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
// END OF FILE: HERO-PLAYGROUND-R4 | Hero.jsx
