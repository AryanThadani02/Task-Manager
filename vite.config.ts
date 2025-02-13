import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    allowedHosts: ['4eb6d8a1-5f10-4d69-b040-d3d8841a1fa6-00-4uvevmtf5vf1.pike.replit.dev']
  }
})
