// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
//
// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import api from "./src/api/api";

export default defineConfig({
  plugins: [react()],
  server: {
    // port: 5173,
    allowedHosts: true,
    // hmr: {
    //   clientPort: 5173,
    // },
    proxy: {
      "/socket.io": {
        target: api.API_SOCKET_URL,
        ws: true,
        changeOrigin: true,
        secure: false,
        headers: {
          "api-access": "true",
          "ngrok-skip-browser-warning": "true",
          skip_zrok_interstitial: "true",
        },
      },
      "/auth": {
        target: api.API_BACKEND_URL,
        changeOrigin: true,
        secure: false,
        // autoRewrite: true,
        // cookieDomainRewrite: "localhost",
        headers: {
          "api-access": "true",
          "ngrok-skip-browser-warning": "true",
          skip_zrok_interstitial: "true",
        },
        bypass: function (req, res, proxyOptions) {
          if (req.headers.accept && req.headers.accept.indexOf("html") !== -1) {
            return "/index.html";
          }
        },
      },
      "/api": {
        target: api.API_BACKEND_URL,
        changeOrigin: true,
        secure: false,
        headers: {
          "api-access": "true",
          "ngrok-skip-browser-warning": "true",
          skip_zrok_interstitial: "true",
        },
      },
      "/play": {
        target: api.API_BACKEND_URL,
        changeOrigin: true,
        secure: false,
        headers: {
          "api-access": "true",
          "ngrok-skip-browser-warning": "true",
          skip_zrok_interstitial: "true",
        },
        bypass: function (req, res, proxyOptions) {
          if (req.headers.accept && req.headers.accept.indexOf("html") !== -1) {
            return "/index.html";
          }
        },
      },
      "/admin": {
        target: api.API_BACKEND_URL,
        changeOrigin: true,
        secure: false,
        headers: {
          "api-access": "true",
          "ngrok-skip-browser-warning": "true",
          skip_zrok_interstitial: "true",
        },
        bypass: function (req, res, proxyOptions) {
          if (req.headers.accept && req.headers.accept.indexOf("html") !== -1) {
            return "/index.html";
          }
        },
      },
      "/uploads": {
        target: api.API_BASE_URL,
        changeOrigin: true,
        secure: false,
        headers: {
          "api-access": "true",
          "ngrok-skip-browser-warning": "true",
          skip_zrok_interstitial: "true",
        },
      },
    },
  },
});
