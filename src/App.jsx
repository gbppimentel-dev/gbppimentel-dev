import { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import About from "./components/About";
import Footer from "./components/Footer";
import CursorEffects from "./components/CursorEffects";
import Projects from "./components/Projects";
import Awards from "./components/Awards";

const slideBrandColors = ['var(--amber)', 'var(--coral)', 'var(--blue)'];

export default function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-accent', slideBrandColors[activeSlide] ?? slideBrandColors[0]);
    return () => root.style.removeProperty('--brand-accent');
  }, [activeSlide]);
  useEffect(() => {
    document.body.classList.add("page-loaded");
    return () => document.body.classList.remove("page-loaded");
  }, []);
  return (
    <>
      <a className="skip-link" href="#about">Skip to content</a>
      <Navigation />
      <CursorEffects />
      <Hero onActiveSlideChange={setActiveSlide} />
      <main>
        <About />
        <Projects />
        <Awards />
        <Footer />
      </main>
    </>
  );
}
