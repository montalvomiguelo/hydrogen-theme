import { removeTrapFocus, trapFocus } from '@/lib/a11y'
import DetailsModal from './details-modal'

class HeaderDrawer extends DetailsModal {
  open (event) {
    setTimeout(() => {
      this.summaryToggle.nextElementSibling.classList.add('translate-x-0')
    })
    this.onBodyClickEvent =
      this.onBodyClickEvent || this.onBodyClick.bind(this)
    event.target.closest('details').setAttribute('open', true)
    document.body.addEventListener('click', this.onBodyClickEvent)
    document.body.classList.add('overflow-hidden', 'lg:overflow-auto')

    trapFocus(
      this.detailsContainer.querySelector('[tabindex="-1"]')
    )
  }

  close (focusToggle = true) {
    removeTrapFocus(focusToggle ? this.summaryToggle : null)
    document.body.removeEventListener('click', this.onBodyClickEvent)
    this.summaryToggle.nextElementSibling.classList.remove('translate-x-0')
    document.body.classList.remove('overflow-hidden', 'lg:overflow-auto')
    this.closeAnimation()
  }
}

window.customElements.define('header-drawer', HeaderDrawer)
