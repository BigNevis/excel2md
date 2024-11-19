import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: ['react', 'react-dom', 'lucide-react', 'xlsx'],
    },
  },
  optimizeDeps: {
    include: ['lucide-react', 'xlsx'],
  },
  server: {
    host: true,
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  },
})