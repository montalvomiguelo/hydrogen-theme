/** @type {import('prettier').Config} */
module.exports = {
  singleQuote: true,
  semi: false,
  printWidth: 80,
  trailingComma: 'none',
  plugins: [
    require.resolve('@shopify/prettier-plugin-liquid/standalone'),
    'prettier-plugin-tailwindcss'
  ],
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
