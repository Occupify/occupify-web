import path from 'node:path'
import { defineConfig, loadEnv, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isAnalyze = mode === 'analyze'
  const port = Number(env.VITE_APP_PORT) || 3000

  return {
    plugins: [
      react(),
      tailwindcss(),
      isAnalyze &&
        (visualizer({
          open: true,
          filename: 'dist/stats.html',
          gzipSize: true,
        }) as PluginOption),
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },

    server: {
      port,
      host: true,
    },

    build: {
      target: 'es2022',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (
                id.includes('react') ||
                id.includes('react-dom') ||
                id.includes('react-router-dom')
              ) {
                return 'vendor-react'
              }
              if (id.includes('@tanstack/react-query')) {
                return 'vendor-query'
              }
              if (id.includes('@phosphor-icons/react')) {
                return 'vendor-icons'
              }
              if (id.includes('zustand') || id.includes('clsx') || id.includes('tailwind-merge')) {
                return 'vendor-ui'
              }
            }
          },
        },
      },
    },
  }
})
