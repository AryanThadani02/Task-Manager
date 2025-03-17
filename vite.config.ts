
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: [
      "https://task-manager-xktj.vercel.app/",
      "63e7d6b8-23c3-4ba2-b9c1-9c6bdf5a66c5-00-2l8nlol0nwj32.pike.replit.dev"
    ],
  },
});
