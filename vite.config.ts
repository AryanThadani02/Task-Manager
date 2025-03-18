
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
      "e3eea226-55a5-4475-a44a-5c0a144e49d8-00-24lzdmw0fjnlr.pike.replit.dev"
    ],
  },
});
