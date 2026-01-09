import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: "https://chat-sockeio-1.onrender.com",
        changeOrigin: true, // Importante: Engaña al backend para que crea que la petición viene del mismo origen
        secure: false,      // 👈 ¡ESTO SOLUCIONA TU ERROR! Ignora la verificación estricta SSL
      },
      '/uploads': {
        target: "https://chat-sockeio-1.onrender.com",
        changeOrigin: true,
        secure: false,      // También aquí, para que carguen las imágenes
      },
    }
  }
})