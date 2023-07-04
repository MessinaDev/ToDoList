import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        name: "To-Do",
        short_name: "ToDo",
        description: "Task list",
        theme_color: "#181818",
        icons: [
          {
            src: "./icons/512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "./icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "./icons/512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "./icons/192.png",
            sizes: "192x192",
            type: "image/png"
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  server: {
    port: 8088
  }
});
