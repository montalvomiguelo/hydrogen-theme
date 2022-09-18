import 'vite/modulepreload-polyfill'
import '@/components/localization-form'
import '@/components/sticky-header'
import '@/components/header-drawer'
import '@/components/cart-drawer'
import { onKeyUpEscape } from '@/lib/a11y'

document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
  summary.setAttribute('role', 'button')
  summary.setAttribute('aria-expanded', summary.parentNode.hasAttribute('open'))

  if (summary.nextElementSibling.getAttribute('id')) {
    summary.setAttribute('aria-controls', summary.nextElementSibling.id)
  }

  summary.addEventListener('click', (event) => {
    event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'))
  })

  summary.parentElement.addEventListener('keyup', onKeyUpEscape)
})
