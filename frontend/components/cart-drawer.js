import { trapFocus, removeTrapFocus } from '@/lib/a11y'

class CartDrawer extends window.HTMLElement {
  constructor () {
    super()
    this.dialog = this.querySelector('[role="dialog"]')
    this.overlay = this.querySelector('#CartDrawer-Overlay')
    this.closeButton = this.querySelector('.js-close-button')
    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close())
    this.overlay.addEventListener('click', this.close.bind(this))
    this.closeButton.addEventListener('click', this.close.bind(this))
    this.setHeaderCartIconAccessibility()
  }

  setHeaderCartIconAccessibility () {
    const cartLink = document.querySelector('#cart-icon-bubble')
    cartLink.setAttribute('role', 'button')
    cartLink.setAttribute('aria-haspopup', 'dialog')
    cartLink.addEventListener('click', (event) => {
      event.preventDefault()
      this.open(cartLink)
    })
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault()
        this.open(cartLink)
      }
    })
  }

  open (triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy)
    this.classList.remove('invisible')
    this.overlay.classList.remove('hidden')
    this.dialog.classList.remove('translate-x-full')

    // a timeout seems to help trap the focus on the dialog after the cart-drawer is visible
    setTimeout(() => {
      trapFocus(this.dialog)
    }, 100)

    document.body.classList.add('overflow-hidden')
  }

  close () {
    removeTrapFocus(this.activeElement)
    this.overlay.classList.add('hidden')
    this.dialog.classList.add('translate-x-full')
    document.body.classList.remove('overflow-hidden')
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
        this.classList.add('invisible')
      }
    }

    window.requestAnimationFrame(handleAnimation)
  }

  setActiveElement (element) {
    this.activeElement = element
  }
}

window.customElements.define('cart-drawer', CartDrawer)
