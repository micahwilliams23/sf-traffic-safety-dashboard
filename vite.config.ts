import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/sf-traffic-safety-dashboard",
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
