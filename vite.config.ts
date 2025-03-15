
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
      "1002e4eb-ad3e-42a9-9200-bd88ff0b5bbd-00-3odt6vlogpu14.pike.replit.dev"
    ],
  },
});
