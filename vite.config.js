import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // Add this line
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://react-jayjays.vercel.app',
        changeOrigin: true,
      }
    }
  }
})
