import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    allowedHosts: [
      "7314c0be-1177-4d88-8b3e-6ef1123973e1-00-q30xllo7c8xt.pike.replit.dev",
    ],
  },
});
