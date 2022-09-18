import { removeTrapFocus, trapFocus } from '@/lib/a11y'
import DetailsModal from './details-modal'

class HeaderDrawer extends DetailsModal {
  constructor () {
    super()
    this.summaryToggle.nextElementSibling.classList.add('transition', 'duration-300', '-translate-x-full')
  }

  open (event) {
    setTimeout(() => {
      this.detailsContainer.classList.add('menu-opening')
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
    this.detailsContainer.classList.remove('menu-opening')
    this.summaryToggle.nextElementSibling.classList.remove('translate-x-0')
    document.body.classList.remove('overflow-hidden', 'lg:overflow-auto')
    this.closeAnimation()
  }

  closeAnimation () {
    let animationStart

    const handleAnimation = time => {
      if (animationStart === undefined) {
        animationStart = time
      }
      const elapsedTime = time - animationStart

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation)
      } else {
        this.detailsContainer.removeAttribute('open')
      }
    }

    window.requestAnimationFrame(handleAnimation)
  }
}

window.customElements.define('header-drawer', HeaderDrawer)
