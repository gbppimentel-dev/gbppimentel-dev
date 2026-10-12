import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative asset paths also work when hosted below a GitHub Pages repo path.
export default defineConfig({ plugins: [react()], base: "./" });
