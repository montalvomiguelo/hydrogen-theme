import { fetchConfig } from '@/lib/utils'
import { dispatchCartEvent } from '@/lib/cart-events'

class ProductForm extends window.HTMLElement {
  constructor() {
    super()

    this.form = this.querySelector('form')
    this.form.querySelector('[name="id"]').disabled = false
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this))
    this.submitButton = this.querySelector('[type="submit"]')
    if (document.querySelector('cart-drawer'))
      this.submitButton.setAttribute('aria-haspopup', 'dialog')
  }

  onSubmitHandler(evt) {
    evt.preventDefault()
    if (this.submitButton.getAttribute('aria-disabled') === true) return

    this.handleErrorMessage()

    this.submitButton.setAttribute('aria-disabled', true)
    this.submitButton.classList.add('loading')

    const config = fetchConfig('javascript')
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    delete config.headers['Content-Type']

    const formData = new window.FormData(this.form)
    const variantId = formData.get('id')
    const quantity = formData.get('quantity') || 1

    const cartDrawer = document.querySelector('cart-drawer')
    if (cartDrawer) {
      formData.append(
        'sections',
        cartDrawer.getSectionsToRender().map((section) => section.id)
      )
      formData.append('sections_url', window.location.pathname)
    }
    config.body = formData

    dispatchCartEvent('adding', {
      variantId,
      quantity,
      form: this.form
    })

    fetch(`${window.routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          this.handleErrorMessage(response.description)

          this.submitButton.setAttribute('aria-disabled', true)
          this.error = true
          dispatchCartEvent('error', {
            error: response.description,
            action: 'add'
          })
          return
        }

        if (!cartDrawer) {
          window.location = window.routes.cart_url
          return
        }

        this.error = false
        dispatchCartEvent('added', {
          variantId,
          quantity,
          cart: response,
          sections: response.sections
        })
      })
      .catch((e) => {
        console.error(e)
        dispatchCartEvent('error', {
          error: e.message,
          action: 'add'
        })
      })
      .finally(() => {
        this.submitButton.classList.remove('loading')
        if (cartDrawer && cartDrawer.classList.contains('is-empty'))
          cartDrawer.classList.remove('is-empty')
        if (!this.error) this.submitButton.removeAttribute('aria-disabled')
      })
  }

  handleErrorMessage(errorMessage = false) {
    this.errorMessage =
      this.errorMessage || this.querySelector('[data-error-message]')

    this.errorMessage.toggleAttribute('hidden', !errorMessage)

    if (errorMessage) {
      this.errorMessage.textContent = errorMessage
    }
  }
}

window.customElements.define('product-form', ProductForm)
