import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/bootstrap.min.css";
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

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
