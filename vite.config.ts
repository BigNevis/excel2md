import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'components': path.resolve(__dirname, './components'),
      },
    },
    define: {
      // Definir la variable de entorno para la clave de API de OpenAI
      'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(env.VITE_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY)
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['lucide-react', 'xlsx', 'class-variance-authority', 'tailwind-merge'],
    },
    server: {
      host: true,
      port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    },
  }
})