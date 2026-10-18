/* CHANGE VERSION: ADAPTIVE-COLORS-R1 | Synchronized palette fades across the existing site */
import { useEffect, useRef, useState } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import About from "./components/About";
import Footer, { Contact } from "./components/Footer";
import CursorEffects from "./components/CursorEffects";
import Projects from "./components/Projects";
import Awards from "./components/Awards";
import PageLoader from "./components/PageLoader";
import { createColorTransition, publishAdaptiveAccent } from './utils/adaptiveColors';

const slideBrandColors = ['--amber', '--coral', '--blue'];
const slideStrapColors = ['#d8b97c', '#d79998', '#93aec6'];
const readTarget = () => window.location.hash.slice(1) || "home";
const readPage = () => {
  const target = readTarget();
  return target === "projects" || target === "awards" ? target : "home";
};

export default function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [page, setPage] = useState(readPage);
  const [navigationTarget, setNavigationTarget] = useState(readTarget);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const pageRef = useRef(page);
  const transitionTimer = useRef(0);
  const accentTransition = useRef(null);

  useEffect(() => {
    let minimumElapsed = false;
    let documentReady = document.readyState === "complete";
    let completed = false;
    const finishIfReady = () => {
      if (completed || !minimumElapsed || !documentReady) return;
      completed = true;
      setLoaderVisible(false);
    };
    const markDocumentReady = () => {
      documentReady = true;
      finishIfReady();
    };
    const minimumTimer = window.setTimeout(() => {
      minimumElapsed = true;
      finishIfReady();
    }, 2800);

    if (!documentReady) window.addEventListener("load", markDocumentReady, { once: true });
    finishIfReady();
    return () => {
      window.clearTimeout(minimumTimer);
      window.removeEventListener("load", markDocumentReady);
    };
  }, []);

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
    const index = activeSlide >= 0 && activeSlide < slideBrandColors.length ? activeSlide : 0;
    const target = getComputedStyle(document.documentElement).getPropertyValue(slideBrandColors[index]).trim() || slideStrapColors[index];
    accentTransition.current?.to(target);
  }, [activeSlide]);

  useEffect(() => {
    document.body.classList.add("page-loaded");
    return () => document.body.classList.remove("page-loaded");
  }, []);

  useEffect(() => {
    const showLoaderNow = () => {
      // Engage the opaque layer before the browser performs the hash navigation.
      document.querySelector(".page-loader")?.classList.add("is-visible");
      setLoaderVisible(true);
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

      const target = destination.hash.slice(1);
      const nextPage = target === "projects" || target === "awards" ? target : "home";
      if (nextPage !== pageRef.current) showLoaderNow();
    };
    const syncLocation = () => {
      const nextPage = readPage();
      const routeChanged = nextPage !== pageRef.current;
      pageRef.current = nextPage;
      setPage(nextPage);
      setNavigationTarget(readTarget());
      if (routeChanged) {
        showLoaderNow();
        window.clearTimeout(transitionTimer.current);
        transitionTimer.current = window.setTimeout(() => setLoaderVisible(false), 1500);
      }
    };
    document.addEventListener("click", handleRouteIntent, true);
    window.addEventListener("hashchange", syncLocation);
    window.addEventListener("popstate", syncLocation);
    return () => {
      document.removeEventListener("click", handleRouteIntent, true);
      window.removeEventListener("hashchange", syncLocation);
      window.removeEventListener("popstate", syncLocation);
      window.clearTimeout(transitionTimer.current);
    };
  }, []);

  useEffect(() => {
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
      const cappedSection = (target === 'about' || target === 'contact') && window.matchMedia('(min-width: 1000px)').matches;
      const stage = cappedSection ? destination.closest('.about-scroll-stage, .contact-scroll-stage') : null;
      const hold = stage?.nextElementSibling;
      // A sticky stage's visible top moves; its following spacer stays in flow.
      const originTop = stage && hold?.matches('.about-scroll-hold, .contact-scroll-hold')
        ? hold.getBoundingClientRect().top - stage.getBoundingClientRect().height
        : destination.getBoundingClientRect().top;
      const topInset = stage ? parseFloat(getComputedStyle(stage).getPropertyValue('--about-cap-top') || getComputedStyle(stage).getPropertyValue('--contact-cap-top')) || 88 : 0;
      window.scrollTo({
        top: Math.max(0, window.scrollY + originTop - topInset),
        behavior: reducedMotion ? "instant" : "smooth",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [page, navigationTarget]);

  return (
    <>
      <PageLoader visible={loaderVisible} />
      <a className="skip-link" href="#about">Skip to content</a>
      <Navigation />
      <CursorEffects />
      {page === "home" ? (
        <>
          <Hero onActiveSlideChange={setActiveSlide} />
          <main className="landing-main">
            <div className="landing-overlap">
              <About strapColor={slideStrapColors[activeSlide] ?? slideStrapColors[0]} />
              <Contact><Footer showBackToTop={false} /></Contact>
            </div>
          </main>
        </>
      ) : (
        <main className="secondary-page">
          {page === "projects" ? <Projects /> : <Awards />}
          <Footer />
        </main>
      )}
    </>
  );
}

/* END OF FILE: ADAPTIVE-COLORS-R1 | App.jsx */
