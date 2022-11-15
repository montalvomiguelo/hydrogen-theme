import 'vite/modulepreload-polyfill'
import { initDetails } from '@/lib/a11y'
import revive from '@/lib/revive.js'

const islands = import.meta.glob('@/islands/**.js')
const summaries = document.querySelectorAll('[id^="Details-"] summary')

revive(islands)
initDetails(summaries)
