import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    allowedHosts: [
      "afdbfd35-13c7-4d77-bea7-b2ece0b43a38-00-289wk7jp88beq.pike.replit.dev",
    ],
  },
});
