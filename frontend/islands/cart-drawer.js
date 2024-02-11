import { trapFocus, removeTrapFocus } from '@/lib/a11y'

class CartDrawer extends window.HTMLElement {
  constructor() {
    super()

    this.addEventListener(
      'keyup',
      (evt) => evt.code === 'Escape' && this.close()
    )
    this.querySelector('#CartDrawer-Overlay').addEventListener(
      'click',
      this.close.bind(this)
    )
    this.setHeaderCartIconAccessibility()
  }

  setHeaderCartIconAccessibility() {
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

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy)
    // here the animation doesn't seem to always get triggered. A timeout seem to help
    setTimeout(() => {
      this.classList.add('active')
    })

    this.addEventListener(
      'transitionend',
      () => {
        const containerToTrapFocusOn = document.getElementById('CartDrawer')
        const focusElement = this.querySelector('[tabindex="-1"]')
        trapFocus(containerToTrapFocusOn, focusElement)
      },
      { once: true }
    )

    document.body.classList.add('overflow-hidden')
  }

  close() {
    this.classList.remove('active')
    removeTrapFocus(this.activeElement)
    document.body.classList.remove('overflow-hidden')
  }

  renderContents(parsedState) {
    this.productId = parsedState.id
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id)
      sectionElement.innerHTML = this.getSectionInnerHTML(
        parsedState.sections[section.id],
        section.selector
      )
    })

    setTimeout(() => {
      this.querySelector('#CartDrawer-Overlay').addEventListener(
        'click',
        this.close.bind(this)
      )
      this.open()
    })
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new window.DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer'
      },
      {
        id: 'cart-icon-bubble'
      }
    ]
  }

  setActiveElement(element) {
    this.activeElement = element
  }
}

window.customElements.define('cart-drawer', CartDrawer)
