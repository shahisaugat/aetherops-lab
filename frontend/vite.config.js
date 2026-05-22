import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/users": {
        target: "https://aetherops.duckdns.org",
        changeOrigin: true,
        secure: true,
      },
      "/health": {
        target: "https://aetherops.duckdns.org",
        changeOrigin: true,
        secure: true,
      },
      "/metrics": {
        target: "https://aetherops.duckdns.org",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
