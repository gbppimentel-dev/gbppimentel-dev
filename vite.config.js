// CHANGE VERSION: HEARTS-PAGES-R1 | 2026-10-20 | Complete vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Pages supplies its real base path at build time. Local builds retain the
// existing relative paths, so development and downloaded previews still work.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "./",
});
// END OF FILE: HEARTS-PAGES-R1 | vite.config.js
