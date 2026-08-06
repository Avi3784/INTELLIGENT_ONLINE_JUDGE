/**
 * Vite Configuration
 * 
 * - Uses the React plugin for JSX/Fast Refresh support
 * - Configures a dev proxy so /api requests are forwarded to the backend
 *   running on port 5000. This avoids CORS issues during development.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js']
  },
  server: {
    // Proxy API requests to the Express backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
