module.exports = {
  plugins: [
    require('@shopify/prettier-plugin-liquid/standalone'),
    require('prettier-plugin-tailwindcss')
  ],
  overrides: [
    {
      files: '*.liquid',
      options: {
        parser: 'liquid-html'
      }
    }
  ]
}
