import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/logout': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/me': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/data_pegawai': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/data_jabatan': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/data_kehadiran': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/potongan_gaji': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/data_gaji': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/images': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
