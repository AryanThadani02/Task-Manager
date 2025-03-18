
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
      "37d00585-119f-4f63-be6b-ad20b6f48332-00-2lyr2mpvoaa4h.pike.replit.dev"
    ],
  },
});
