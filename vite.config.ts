import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    allowedHosts: [
      "fe4d8445-6070-4f98-92b0-98808d110bba-00-35swho9v8hnmh.sisko.replit.dev",
    ],
  },
});
