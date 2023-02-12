import 'vite/modulepreload-polyfill'
import { initDisclosureWidgets } from '@/lib/a11y'
import { revive, islands } from '@/lib/revive.js'

const summaries = document.querySelectorAll('[id^="Details-"] summary')

revive(islands)
initDisclosureWidgets(summaries)
