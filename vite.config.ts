
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
      "2d197419-8972-4f37-9247-5f96d4b2a8bb-00-1dvlgf4r3vyuv.sisko.replit.dev"
    ],
  },
});
