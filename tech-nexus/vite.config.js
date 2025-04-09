import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  assetsInclude: ['**/*.PNG'],
  resolve: {
    alias: {
      '@fortawesome/fontawesome-free': '/node_modules/@fortawesome/fontawesome-free'
    }
  },
})
