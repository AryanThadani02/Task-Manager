
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
      "11b0aa01-58d4-459f-853d-3b18d94216d7-00-pmpbjmr4rdud.pike.replit.dev"
    ],
  },
});
