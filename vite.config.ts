import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: ['react', 'react-dom', 'lucide-react'],
    },
  },
  optimizeDeps: {
    include: ['lucide-react'],
  },
  server: {
    host: true,
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  },
})