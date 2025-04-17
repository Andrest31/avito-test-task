import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Адрес вашего Go-сервера
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1') // Преобразуем /api в /api/v1
      }
    }
  }
})
