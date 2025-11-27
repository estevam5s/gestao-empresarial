import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: true
    }
  },
  define: {
    global: 'globalThis'
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia']
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true
    },
    // Otimizações de performance
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs em produção
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      }
    },
    // Code splitting e chunking otimizado
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks para melhor cache
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'charts': ['chart.js'],
          'utils': ['date-fns', 'xlsx']
        },
        // Nomes de arquivo com hash para cache bust
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // Otimizar tamanho do chunk
    chunkSizeWarningLimit: 1000,
    // Source maps apenas em dev
    sourcemap: false
  }
})