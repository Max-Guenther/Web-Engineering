import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  // Relative Pfade, weil die Seite bei GitHub Pages unter /Web-Engineering/ liegt und nicht an der Domain-Wurzel
  base: "./",
  build: {
    // Vite baut von sich aus nur index.html, die anderen Seiten müssen hier stehen
    rollupOptions: {
      input: ["index.html", "finder.html", "ueber.html"],
    },
  },
});
