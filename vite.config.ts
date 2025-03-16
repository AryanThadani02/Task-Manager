
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
      "e0df0c4f-ae5d-43be-824b-819fc3fe1119-00-2vq1qvum0cvlx.sisko.replit.dev"
    ],
  },
});
