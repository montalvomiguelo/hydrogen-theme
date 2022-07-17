import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [shopify()]
})
