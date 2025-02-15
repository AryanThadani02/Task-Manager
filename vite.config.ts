import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    allowedHosts: [
      "5e0569d7-12e4-4dd7-9f41-6fa59f1234d2-00-2nlbsu1g57l2m.pike.replit.dev",
    ],
  },
});
