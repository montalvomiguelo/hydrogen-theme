import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [shopify()],
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
