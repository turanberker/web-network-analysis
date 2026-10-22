import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev sunucusunda /api isteklerini backend'e, /geoserver isteklerini GeoServer'a yönlendir.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": process.env.VITE_API_PROXY ?? "http://localhost:8080",
      "/geoserver": process.env.VITE_GEOSERVER_PROXY ?? "http://localhost:8081",
    },
  },
});
