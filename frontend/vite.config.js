import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite config: how the React app is built and how the dev server behaves.
export default defineConfig({
  plugins: [
    react(),        // enables JSX and Fast Refresh
    tailwindcss(),  // Tailwind CSS v4 Vite plugin
  ],
  server: {
    port: 5173,
    // Browser calls /api/... on the Vite server.
    // Vite forwards those requests to Spring Boot so we do not need CORS yet.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
