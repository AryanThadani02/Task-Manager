
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
      "18c01fde-58f3-456b-add4-5992c92c494e-00-pbj3gt1iqao5.pike.replit.dev"
    ],
  },
});
