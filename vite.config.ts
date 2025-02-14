import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    allowedHosts: [
      "e0df1fa3-8e49-4884-bff0-ac7fdc30746f-00-3c47f0pb5mq68.pike.replit.dev",
    ],
  },
});
