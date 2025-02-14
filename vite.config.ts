import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    allowedHosts: [
      "2cf388a1-3b2a-4c94-b05a-eafd97a141de-00-3b2fkgmqfu2vo.sisko.replit.dev",
    ],
  },
});
