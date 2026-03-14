import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Dosya yollarının başına nokta koyarak her yerde çalışmasını sağlar
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})