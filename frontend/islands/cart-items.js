import { debounce, fetchConfig } from '@/lib/utils'
import { trapFocus } from '@/lib/a11y'

export default class CartItems extends window.HTMLElement {
  constructor() {
    super()

    this.lineItemStatusElement =
      document.getElementById('shopping-cart-line-item-status') ||
      document.getElementById('CartDrawer-LineItemStatus')

    this.currentItemCount = Array.from(
      this.querySelectorAll('[name="updates[]"]')
    ).reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0)

    this.debouncedOnChange = debounce((event) => {
      this.onChange(event)
    }, 300)

    this.addEventListener('change', this.debouncedOnChange)
  }

  onChange(event) {
    this.updateQuantity(
      event.target.dataset.index,
      event.target.value,
      document.activeElement.getAttribute('name')
    )
  }

  getSectionsToRender() {
    return [
      {
        id: 'main-cart-items',
        section: document.getElementById('main-cart-items').dataset.id,
        selector: '.js-contents'
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      },
      {
        id: 'cart-live-region-text',
        section: 'cart-live-region-text',
        selector: '.shopify-section'
      },
      {
        id: 'cart-subtotal',
        section: 'cart-subtotal',
        selector: '.shopify-section'
      }
    ]
  }

  updateQuantity(line, quantity, name) {
    this.enableLoading(line)

    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    })

    fetch(`${window.routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        return response.text()
      })
      .then((state) => {
        const parsedState = JSON.parse(state)
        this.classList.toggle('is-empty', parsedState.item_count === 0)
        const cartDrawerWrapper = document.querySelector('cart-drawer')

        if (cartDrawerWrapper)
          cartDrawerWrapper.classList.toggle(
            'is-empty',
            parsedState.item_count === 0
          )

        this.getSectionsToRender().forEach((section) => {
          const elementToReplace =
            document
              .getElementById(section.id)
              .querySelector(section.selector) ||
            document.getElementById(section.id)
          elementToReplace.innerHTML = this.getSectionInnerHTML(
            parsedState.sections[section.section],
            section.selector
          )
        })

        this.updateLiveRegions(line, parsedState.item_count)
        const lineItem =
          document.getElementById(`CartItem-${line}`) ||
          document.getElementById(`CartDrawer-Item-${line}`)
        if (lineItem && lineItem.querySelector(`[name="${name}"]`)) {
          cartDrawerWrapper
            ? trapFocus(
                cartDrawerWrapper,
                lineItem.querySelector(`[name="${name}"]`)
              )
            : lineItem.querySelector(`[name="${name}"]`).focus()
        } else if (parsedState.item_count === 0 && cartDrawerWrapper) {
          trapFocus(
            cartDrawerWrapper.querySelector('#CartDrawer'),
            cartDrawerWrapper.querySelector('[tabindex="-1"]')
          )
        } else if (document.querySelector('.cart-item') && cartDrawerWrapper) {
          trapFocus(
            cartDrawerWrapper,
            document.querySelector('.cart-item-name')
          )
        }
        this.disableLoading()
      })
      .catch(() => {
        this.querySelectorAll('.loading-overlay').forEach((overlay) =>
          overlay.classList.add('hidden')
        )
        const errors =
          document.getElementById('cart-errors') ||
          document.getElementById('CartDrawer-CartErrors')
        errors.textContent = window.cartStrings.error
        this.disableLoading()
      })
  }

  updateLiveRegions(line, itemCount) {
    if (this.currentItemCount === itemCount) {
      const lineItemError =
        document.getElementById(`Line-item-error-${line}`) ||
        document.getElementById(`CartDrawer-LineItemError-${line}`)
      const quantityElement =
        document.getElementById(`Quantity-${line}`) ||
        document.getElementById(`Drawer-quantity-${line}`)
      lineItemError.innerHTML = window.cartStrings.quantityError.replace(
        '[quantity]',
        quantityElement.value
      )
    }

    this.currentItemCount = itemCount
    this.lineItemStatusElement.setAttribute('aria-hidden', true)

    const cartStatus =
      document.getElementById('cart-live-region-text') ||
      document.getElementById('CartDrawer-LiveRegionText')
    cartStatus.setAttribute('aria-hidden', false)

    setTimeout(() => {
      cartStatus.setAttribute('aria-hidden', true)
    }, 1000)
  }

  getSectionInnerHTML(html, selector) {
    return new window.DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML
  }

  enableLoading(line) {
    const mainCartItems =
      document.getElementById('main-cart-items') ||
      document.getElementById('CartDrawer-CartItems')
    mainCartItems.classList.add('loading')

    const cartItemElements = this.querySelectorAll(
      `#CartItem-${line} .loading-overlay`
    )
    const cartDrawerItemElements = this.querySelectorAll(
      `#CartDrawer-Item-${line} .loading-overlay`
    )

    ;[...cartItemElements, ...cartDrawerItemElements].forEach((overlay) =>
      overlay.classList.remove('hidden')
    )

    document.activeElement.blur()
    this.lineItemStatusElement.setAttribute('aria-hidden', false)
  }

  disableLoading() {
    const mainCartItems =
      document.getElementById('main-cart-items') ||
      document.getElementById('CartDrawer-CartItems')
    mainCartItems.classList.remove('loading')
  }
}

window.customElements.define('cart-items', CartItems)
