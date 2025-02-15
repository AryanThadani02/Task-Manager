import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    allowedHosts: [
      "8d6f8d31-b25a-4381-8aa8-d491c8a166c9-00-26yfco039f80f.sisko.replit.dev",
    ],
  },
});
