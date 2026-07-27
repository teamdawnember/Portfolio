import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward API calls to the Express contact server during `npm run dev`,
    // so the frontend can POST to a relative /api/contact with no CORS.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
