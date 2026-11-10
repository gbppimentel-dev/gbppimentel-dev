/* CHANGE VERSION: ABOUT-PROFILE-R2 | 2026-10-20 | Complete App.jsx */
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import About from "./components/About";
import Footer, { Contact } from "./components/Footer";
import CursorEffects from "./components/CursorEffects";
import PageLoader from "./components/PageLoader";
import BackToTop from "./components/BackToTop";
import { createColorTransition, publishAdaptiveAccent, startAdaptiveColorCycle } from './utils/adaptiveColors';
import { AnimationActivityContext, useAnimationPreferences } from './hooks/useAnimationActivity';
import { afterFirstPaint, createPageLoader } from './utils/pageLoader';
import { asset, mobileAsset } from './utils/assets';

// Case-study code and its CSS are fetched only when that view is opened.
const Projects = lazy(() => import('./components/Projects'));
const NetSuite = lazy(() => import('./components/NetSuite'));

function RouteReady({ children, page, generation, loader }) {
  useEffect(() => {
    const current = loader.ready(page, generation);
    // A slow route may commit after the overlay's safety deadline. Restore
    // destination focus here as no later overlay dismissal will trigger it.
    if (current && !loader.visible) {
      const destination = document.getElementById(page);
      destination?.setAttribute('tabindex', '-1');
      destination?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [page, generation, loader]);
  return children;
}

const slideBrandColors = ['--amber', '--coral', '--blue'];
const slideStrapColors = ['#d8b97c', '#d79998', '#93aec6'];
// Preserve old bookmarks while the former page is replaced by NetSuite.
const canonicalTarget = target => target === "awards" ? "netsuite" : target;
const pageForTarget = target => target === "projects" || target === "netsuite" ? target : "home";
const readTarget = () => canonicalTarget(window.location.hash.slice(1) || "home");
const readPage = () => {
  const target = readTarget();
  return pageForTarget(target);
};

export default function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [heroCovered, setHeroCovered] = useState(false);
  const paletteIndexRef = useRef(0);
  const [page, setPage] = useState(readPage);
  const [navigationTarget, setNavigationTarget] = useState(readTarget);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [surfaceReady, setSurfaceReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pageRef = useRef(page);
  const { reducedMotion, documentVisible } = useAnimationPreferences();
  const [loader] = useState(() => createPageLoader({
    initialPage: readPage(), onVisible: setLoaderVisible,
    onIntroReady: () => setSurfaceReady(true),
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }));
  const accentTransition = useRef(null);
  const retargetPalette = useCallback(() => {
    const index = paletteIndexRef.current;
    const target = getComputedStyle(document.documentElement).getPropertyValue(slideBrandColors[index]).trim() || slideStrapColors[index];
    accentTransition.current?.to(target);
  }, []);
  const selectPalette = useCallback(index => {
    // The shared CSS/canvas clock owns this value; no React content uses it.
    // Keeping it in a ref avoids reconciling every mounted scene on timer ticks.
    paletteIndexRef.current = Number.isInteger(index) && index >= 0 && index < slideBrandColors.length ? index : 0;
    retargetPalette();
  }, [retargetPalette]);

  useEffect(() => {
    // Let the lightweight HTML loader paint before any scene is mounted. Its
    // recognizable intro is measured from this paint, never module evaluation.
    const cancelPaint = afterFirstPaint(() => loader.start());
    let cancelled = false;
    let documentReady = document.readyState === 'complete';
    let fontsReady = !document.fonts;
    let artworkReady = page !== 'home';
    const settle = () => {
      if (!cancelled && documentReady && fontsReady && artworkReady) {
        window.clearTimeout(readinessLimit);
        loader.resourcesReady();
      }
    };
    const loaded = () => { documentReady = true; settle(); };
    if (!documentReady) window.addEventListener('load', loaded, { once: true });
    const fonts = document.fonts;
    const primaryFonts = fonts ? Promise.all([
      fonts.load('400 16px "Tilt Warp"'), fonts.load('400 16px Poppins'),
      fonts.load('600 16px Poppins'), fonts.load('800 16px Poppins'),
    ]).then(() => fonts.ready) : Promise.resolve();
    primaryFonts.then(() => { fontsReady = true; settle(); }).catch(() => { fontsReady = true; settle(); });
    // Decode the first hero while the small loader owns the screen. The same
    // manifest/base-path helper is used by the mounted responsive background.
    if (!artworkReady) {
      const artwork = new Image();
      artwork.decoding = 'async';
      artwork.fetchPriority = 'high';
      artwork.src = (window.matchMedia('(max-width: 767px)').matches ? mobileAsset : asset)('images/slide01.png');
      const decoded = typeof artwork.decode === 'function' ? artwork.decode() : Promise.resolve();
      decoded.catch(() => {}).then(() => { artworkReady = true; settle(); });
    }
    // A blocked font or resource must never leave the portfolio behind an overlay.
    const readinessLimit = window.setTimeout(() => { if (!cancelled) loader.resourcesReady(); }, 3500);
    settle();
    return () => { cancelled = true; cancelPaint(); window.clearTimeout(readinessLimit); window.removeEventListener('load', loaded); loader.stop(); };
  }, [loader]);

  useEffect(() => { loader.setReduced(reducedMotion); }, [loader, reducedMotion]);
  useEffect(() => {
    if (!surfaceReady || page !== 'home') return undefined;
    return afterFirstPaint(() => loader.ready(page));
  }, [loader, page, surfaceReady]);

  useEffect(() => {
    const root = document.documentElement;
    const previousColor = root.style.getPropertyValue('--brand-accent');
    const styles = getComputedStyle(root);
    const initial = styles.getPropertyValue('--brand-accent').trim() || styles.getPropertyValue('--amber').trim() || slideStrapColors[0];
    accentTransition.current = createColorTransition({ initial, onUpdate: publishAdaptiveAccent });
    return () => {
      accentTransition.current?.destroy();
      accentTransition.current = null;
      if (previousColor) root.style.setProperty('--brand-accent', previousColor);
      else root.style.removeProperty('--brand-accent');
    };
  }, []);

  useEffect(() => {
    retargetPalette();
    window.addEventListener('portfolio-theme-change', retargetPalette);
    return () => window.removeEventListener('portfolio-theme-change', retargetPalette);
  }, [retargetPalette]);

  useEffect(() => {
    if (page === 'home' && !heroCovered) selectPalette(activeSlide);
  }, [activeSlide, heroCovered, page, selectPalette]);

  useEffect(() => {
    if (loaderVisible || mobileMenuOpen) accentTransition.current?.finish();
    if (!documentVisible || reducedMotion || loaderVisible || mobileMenuOpen || (page === 'home' && !heroCovered)) return undefined;
    return startAdaptiveColorCycle({ initialIndex: paletteIndexRef.current, onChange: selectPalette });
  }, [documentVisible, reducedMotion, loaderVisible, mobileMenuOpen, page, heroCovered, selectPalette]);

  useEffect(() => {
    document.body.classList.add("page-loaded");
    return () => document.body.classList.remove("page-loaded");
  }, []);

  useEffect(() => {
    const showLoaderNow = nextPage => {
      // Engage the opaque layer before the browser performs the hash navigation.
      document.querySelector(".page-loader")?.classList.add("is-visible");
      loader.begin(nextPage);
    };
    const handleRouteIntent = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;

      let destination;
      try {
        destination = new URL(link.href, window.location.href);
      } catch {
        return;
      }
      if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname) return;

      const target = canonicalTarget(destination.hash.slice(1));
      const nextPage = pageForTarget(target);
      if (nextPage !== pageRef.current) showLoaderNow(nextPage);
    };
    const syncLocation = () => {
      const nextPage = readPage();
      const routeChanged = nextPage !== pageRef.current;
      pageRef.current = nextPage;
      setPage(nextPage);
      setNavigationTarget(readTarget());
      if (routeChanged) {
        showLoaderNow(nextPage);
      }
    };
    document.addEventListener("click", handleRouteIntent, true);
    window.addEventListener("hashchange", syncLocation);
    window.addEventListener("popstate", syncLocation);
    return () => {
      document.removeEventListener("click", handleRouteIntent, true);
      window.removeEventListener("hashchange", syncLocation);
      window.removeEventListener("popstate", syncLocation);
    };
  }, [loader]);

  useEffect(() => {
    if (loaderVisible) return undefined;
    let frame = 0;
    frame = window.requestAnimationFrame(() => {
      if (page !== "home") {
        const destination = document.getElementById(page);
        destination?.setAttribute("tabindex", "-1");
        destination?.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }

      const target = navigationTarget === "home" ? "home" : navigationTarget;
      const destination = document.getElementById(target);
      if (!destination || target === "home") {
        window.scrollTo({ top: 0, behavior: "instant" });
        if (destination) {
          destination.setAttribute("tabindex", "-1");
          destination.focus({ preventScroll: true });
        }
        return;
      }

      destination.setAttribute("tabindex", "-1");
      destination.focus({ preventScroll: true });
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const candidate = (target === 'about' || target === 'contact')
        ? destination.closest('.about-scroll-stage, .contact-scroll-stage') : null;
      const stage = candidate && getComputedStyle(candidate).position === 'sticky' ? candidate : null;
      const hold = stage?.nextElementSibling;
      // A sticky stage's visible top moves; its following spacer stays in flow.
      const originTop = stage && hold?.matches('.about-scroll-hold, .contact-scroll-hold')
        ? hold.getBoundingClientRect().top - stage.getBoundingClientRect().height
        : destination.getBoundingClientRect().top;
      const topInset = stage
        ? parseFloat(getComputedStyle(stage).getPropertyValue('--about-cap-top') || getComputedStyle(stage).getPropertyValue('--contact-cap-top')) || 88
        : 84;
      window.scrollTo({
        top: Math.max(0, window.scrollY + originTop - topInset),
        behavior: reducedMotion ? "instant" : "smooth",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [page, navigationTarget, loaderVisible]);

  return (
    <>
      <PageLoader visible={loaderVisible} preparing={!surfaceReady} />
      <AnimationActivityContext.Provider value={!loaderVisible}>
      {surfaceReady && <div className="page-surface" inert={loaderVisible}>
      <a className="skip-link" href={page === 'home' ? '#about' : `#${page}`}>Skip to content</a>
      <Navigation onModalChange={setMobileMenuOpen} />
      <CursorEffects />
      {page === "home" ? (
        <>
          <Hero onActiveSlideChange={setActiveSlide} onCoveredChange={setHeroCovered} suspended={mobileMenuOpen || loaderVisible} />
          <main className="landing-main">
            <AnimationActivityContext.Provider value={!mobileMenuOpen && !loaderVisible}>
            <div className="landing-overlap">
              <About strapColor={slideStrapColors[activeSlide] ?? slideStrapColors[0]} />
              <Contact><Footer showBackToTop={false} /></Contact>
            </div>
            </AnimationActivityContext.Provider>
          </main>
        </>
      ) : (
        <main className="secondary-page">
          <Suspense fallback={<div className="route-loading-placeholder" aria-hidden={loaderVisible} role={loaderVisible ? undefined : 'status'}>Loading page…</div>}>
            <RouteReady key={page} page={page} generation={loader.generation} loader={loader}>{page === "projects" ? <Projects /> : <NetSuite />}</RouteReady>
          </Suspense>
          <Footer showBackToTop={false} />
        </main>
      )}
      <BackToTop disabled={loaderVisible} />
      </div>}
      </AnimationActivityContext.Provider>
    </>
  );
}

/* END OF FILE: ABOUT-PROFILE-R2 | App.jsx */
