import { useEffect } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import About from "./components/About";
import Footer from "./components/Footer";
import CursorEffects from "./components/CursorEffects";
import Projects from "./components/Projects";
import Awards from "./components/Awards";

export default function App() {
  useEffect(() => {
    document.body.classList.add("page-loaded");
    return () => document.body.classList.remove("page-loaded");
  }, []);
  return (
    <>
      <a className="skip-link" href="#about">Skip to content</a>
      <Navigation />
      <CursorEffects />
      <Hero />
      <main>
        <About />
        <Projects />
        <Awards />
        <Footer />
      </main>
    </>
  );
}
