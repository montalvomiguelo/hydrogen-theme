import { defineConfig, defaultAllowedOrigins } from 'vite'
import shopify from 'vite-plugin-shopify'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [shopify(), tailwindcss()],
  server: {
    cors: {
      origin: [defaultAllowedOrigins, /\.myshopify\.com$/]
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].min.js',
        chunkFileNames: '[name].[hash].min.js',
        assetFileNames: '[name].[hash].min[extname]'
      }
    }
  }
})
