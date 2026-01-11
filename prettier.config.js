// @ts-check

/** @type {import('prettier').Config} */
export default {
  singleQuote: true,
  semi: false,
  printWidth: 80,
  trailingComma: 'none',
  plugins: ['@shopify/prettier-plugin-liquid', 'prettier-plugin-tailwindcss'],
  tailwindStylesheet: './frontend/entrypoints/theme.css',
  overrides: [
    {
      files: '*.liquid',
      options: {
        parser: 'liquid-html',
        singleQuote: false,
        semi: true,
        printWidth: 120,
        trailingComma: 'all'
      }
    }
  ]
}
