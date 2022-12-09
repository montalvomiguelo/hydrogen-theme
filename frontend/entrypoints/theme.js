import 'vite/modulepreload-polyfill'
import { initDisclosureWidgets } from '@/lib/a11y'
import revive from '@/lib/revive.js'

const islands = import.meta.glob('@/islands/**.js')
const summaries = document.querySelectorAll('[id^="Details-"] summary')

revive(islands)
initDisclosureWidgets(summaries)

if (window.decodeURI(window.location.pathname) === '/account/addresses') {
  import('@/lib/shopify_common')
  import('@/lib/customer-address')
}
