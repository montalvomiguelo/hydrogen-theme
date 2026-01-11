import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'
import importMaps from 'vite-plugin-shopify-import-maps'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    shopify({ tunnel: true, versionNumbers: true }),
    importMaps({
      bareModules: {
        defaultGroup: '@theme'
      },
      modulePreload: true
    }),
    tailwindcss()
  ],
  build: {
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
})
