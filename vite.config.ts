import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    allowedHosts: [
      "fcf2096d-3231-48f4-9a42-ab943ee5f3d4-00-3b8yyj98fa9b.pike.replit.dev",
    ],
  },
});
