/** @type {import('prettier').Config} */
export default {
  singleQuote: true,
  semi: false,
  printWidth: 80,
  trailingComma: 'none',
  plugins: ['@shopify/prettier-plugin-liquid', 'prettier-plugin-tailwindcss'],
  overrides: [
    {
      files: '*.liquid',
      options: {
        parser: 'liquid-html',
        singleQuote: false,
        printWidth: 120
      }
    }
  ]
}
