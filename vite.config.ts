import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    allowedHosts: [
      "https://task-manager-xktj.vercel.app/",
      "https://2c333e16-10be-4378-96cc-4c456449a0ba-00-30pt7l0j5p4e1.sisko.replit.dev/"
    ],
  },
});
