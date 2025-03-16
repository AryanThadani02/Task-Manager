
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: [
      "https://task-manager-xktj.vercel.app/",
      "058f37b3-c4cd-491b-b168-392c742ed315-00-1vzb52kivnlsj.pike.replit.dev"
    ],
  },
});
