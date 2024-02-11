const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./frontend/**/*.js', './**/*.liquid'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        contrast: 'rgba(var(--color-contrast) / <alpha-value>)',
        notice: 'rgba(var(--color-accent) / <alpha-value>)',
        shopPay: 'var(--color-shop-pay)'
      },
      screens: {
        sm: '32em',
        md: '48em',
        lg: '64em',
        xl: '80em',
        '2xl': '96em',
        'sm-max': { max: '48em' },
        'sm-only': { min: '32em', max: '48em' },
        'md-only': { min: '48em', max: '64em' },
        'lg-only': { min: '64em', max: '80em' },
        'xl-only': { min: '80em', max: '96em' },
        '2xl-only': { min: '96em' }
      },
      spacing: {
        nav: 'var(--height-nav)',
        screen: 'var(--screen-height, 100vh)'
      },
      height: {
        screen: 'var(--screen-height, 100vh)',
        'screen-no-nav': 'calc(var(--screen-height, 100vh) - var(--height-nav))'
      },
      width: {
        mobileGallery: 'calc(100vw - 3rem)'
      },
      fontFamily: {
        body: 'var(--font-body-family)',
        heading: 'var(--font-heading-family)'
      },
      fontSize: {
        display: ['var(--font-size-display)', '1.1'],
        heading: ['var(--font-size-heading)', '1.25'],
        lead: ['var(--font-size-lead)', '1.333'],
        copy: ['var(--font-size-copy)', '1.5'],
        fine: ['var(--font-size-fine)', '1.333']
      },
      fontWeight: {
        'body-weight': 'var(--font-body-weight)',
        'body-weight-bold': 'var(--font-body-weight-bold)',
        'heading-weight': 'var(--font-heading-weight)'
      },
      maxWidth: {
        'prose-narrow': '45ch',
        'prose-wide': '80ch'
      },
      boxShadow: {
        border: 'inset 0px 0px 0px 1px rgb(var(--color-primary) / 0.08)',
        darkHeader: 'inset 0px -1px 0px 0px rgba(21, 21, 21, 0.4)',
        lightHeader: 'inset 0px -1px 0px 0px rgba(21, 21, 21, 0.05)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    plugin(({ addVariant }) => {
      addVariant('no-js', '.no-js &')
    })
  ]
}
