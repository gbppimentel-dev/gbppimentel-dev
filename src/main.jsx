// CHANGE VERSION: DESKTOP-POLISH-R1 | 2026-10-20 | Complete src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { asset } from "./utils/assets";
import { initializeTheme } from './utils/theme';
import { afterFirstPaint } from './utils/pageLoader';
import './styles/startup-components';
import "./styles/base.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./styles/fonts.css";
import "./styles/style.css";
import "./styles/pdf-button.css";
import "./styles/about-me.css";
import "./styles/migration.css";
import "./styles/refinement.css";
import "./styles/branding.css";
import "./styles/surface-refinement.css";
import "./styles/responsive.css";
import "./styles/hero-technical.css";
import "./styles/hero-actions.css";
import "./styles/hero-polish.css";
import "./styles/hero-systems.css";
import "./styles/hero-two-lines.css";
import "./styles/navigation-depth.css";
import "./styles/themes.css";
import "./styles/themes-pages.css";
import "./styles/runtime-polish.css";
import "./styles/theme-transition.css";

const MotionProbe = import.meta.env.DEV && new URLSearchParams(location.search).has('motion-check')
  ? React.lazy(() => import('./dev/MotionProbe')) : null;

const App = React.lazy(() => import('./App'));
function BootApp() {
  const [painted, setPainted] = React.useState(false);
  React.useEffect(() => afterFirstPaint(() => setPainted(true)), []);
  return painted ? <React.Suspense fallback={null}><App /></React.Suspense> : null;
}

// Restore the portfolio's tab branding even if this localhost tab retained
// another project's head metadata while the development app was replaced.
function applyPortfolioMetadata() {
  const version = "TAB-METADATA-R1";
  document.title = "gbppimentel-dev — Development & Design";

  for (const name of ["application-name", "apple-mobile-web-app-title"]) {
    let meta = document.head.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = name;
      document.head.append(meta);
    }
    meta.content = "gbppimentel-dev";
  }

  // Remove conflicting icon/manifest declarations before installing one set.
  for (const link of document.head.querySelectorAll("link[rel]")) {
    const relations = link.rel.toLowerCase().split(/\s+/);
    if (relations.some((rel) => [
      "icon", "apple-touch-icon", "apple-touch-icon-precomposed",
      "mask-icon", "manifest",
    ].includes(rel))) {
      link.remove();
    }
  }

  const links = [
    { rel: "icon", type: "image/png", sizes: "32x32", path: "brand/triangle-32.png" },
    { rel: "icon", type: "image/png", sizes: "16x16", path: "brand/triangle-16.png" },
    { rel: "shortcut icon", type: "image/png", path: "brand/triangle-32.png" },
    { rel: "apple-touch-icon", sizes: "180x180", path: "brand/triangle-180.png" },
    { rel: "manifest", path: "site.webmanifest" },
  ];
  for (const { path, ...attributes } of links) {
    const link = document.createElement("link");
    for (const [name, value] of Object.entries(attributes)) {
      link.setAttribute(name, value);
    }
    link.href = asset(`${path}?v=${version}`);
    document.head.append(link);
  }
}

applyPortfolioMetadata();
initializeTheme();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BootApp />
    {MotionProbe && <React.Suspense fallback={null}><MotionProbe /></React.Suspense>}
  </React.StrictMode>,
);
// END OF FILE: DESKTOP-POLISH-R1 | src/main.jsx
