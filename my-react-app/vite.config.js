import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // During development the Express API (server/index.js) runs on port 3001.
    // Point elsewhere with API_URL=http://host:port npm run dev:web
    proxy: {
      '/api': process.env.API_URL || 'http://localhost:3001',
    },
  },
})
