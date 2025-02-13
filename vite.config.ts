import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    allowedHosts: [
      "ba69477b-8e99-4883-bdbc-15c8b32cbe46-00-1c5lj7jhupvg6.sisko.replit.dev",
    ],
  },
});
