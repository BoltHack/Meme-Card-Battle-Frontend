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
      "/auth": {
        target: api.API_BACKEND_URL,
        changeOrigin: true,
        secure: false,
        // autoRewrite: true,
        // cookieDomainRewrite: "localhost",
        headers: {
          "ngrok-skip-browser-warning": "true",
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
          "ngrok-skip-browser-warning": "true",
        },
      },
      "/play": {
        target: api.API_BACKEND_URL,
        changeOrigin: true,
        secure: false,
        headers: {
          "ngrok-skip-browser-warning": "true",
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
          "ngrok-skip-browser-warning": "true",
        },
        bypass: function (req, res, proxyOptions) {
          if (req.headers.accept && req.headers.accept.indexOf("html") !== -1) {
            return "/index.html";
          }
        },
      },
      "/uploads": {
        target: api.API_BACKEND_URL,
        changeOrigin: true,
        secure: false,
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
    },
  },
});
