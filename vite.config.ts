import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    allowedHosts: [
      "a862515e-0a2b-4b62-adcd-f5772531917a-00-3ip1aoun6qnue.sisko.replit.dev",
    ],
  },
});
