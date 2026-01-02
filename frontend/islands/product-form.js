import { dispatchCartEvent, onCartEvent } from '@/lib/cart-events'

class ProductForm extends window.HTMLElement {
  constructor() {
    super()

    this.form = this.querySelector('form')
    this.form.querySelector('[name="id"]').disabled = false
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this))
    this.submitButton = this.querySelector('[type="submit"]')
    this.pending = false

    if (document.querySelector('cart-drawer'))
      this.submitButton.setAttribute('aria-haspopup', 'dialog')

    onCartEvent('added', this.onCartAdded.bind(this))
    onCartEvent('error', this.onCartError.bind(this))
  }

  onSubmitHandler(evt) {
    evt.preventDefault()
    if (this.submitButton.getAttribute('aria-disabled') === true) return

    this.handleErrorMessage()
    this.submitButton.setAttribute('aria-disabled', true)
    this.submitButton.classList.add('loading')
    this.pending = true

    const formData = new window.FormData(this.form)
    const variantId = formData.get('id')
    const quantity = parseInt(formData.get('quantity')) || 1
    const properties = this.getLineItemProperties(formData)
    const sellingPlanId = formData.get('selling_plan')

    dispatchCartEvent('add', {
      variantId,
      quantity,
      properties: Object.keys(properties).length > 0 ? properties : undefined,
      sellingPlanId: sellingPlanId || undefined
    })
  }

  getLineItemProperties(formData) {
    const properties = {}
    for (const [key, value] of formData.entries()) {
      const match = key.match(/^properties\[(.+)\]$/)
      if (match && value) {
        properties[match[1]] = value
      }
    }
    return properties
  }

  onCartAdded() {
    if (!this.pending) return
    this.pending = false
    this.submitButton.classList.remove('loading')
    this.submitButton.removeAttribute('aria-disabled')

    const cartDrawer = document.querySelector('cart-drawer')
    if (cartDrawer && cartDrawer.classList.contains('is-empty')) {
      cartDrawer.classList.remove('is-empty')
    }

    if (!cartDrawer) {
      window.location = window.routes.cart_url
    }
  }

  onCartError({ error, action }) {
    if (!this.pending || action !== 'add') return
    this.pending = false
    this.handleErrorMessage(error)
    this.submitButton.classList.remove('loading')
    this.submitButton.setAttribute('aria-disabled', true)
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
