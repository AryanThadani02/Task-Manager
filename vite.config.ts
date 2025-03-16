
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
      "5548171e-ffba-482e-b369-cf5428621a4b-00-1oeg2kr9zehpp.pike.replit.dev"
    ],
  },
});
