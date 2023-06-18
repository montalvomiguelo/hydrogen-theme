import { fetchConfig } from '@/lib/utils'

class ProductForm extends window.HTMLElement {
  constructor() {
    super()

    this.form = this.querySelector('form')
    this.form.querySelector('[name="id"]').disabled = false
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this))
    this.cart = document.querySelector('cart-drawer')
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
    if (this.cart) {
      formData.append(
        'sections',
        this.cart.getSectionsToRender().map((section) => section.id)
      )
      formData.append('sections_url', window.location.pathname)
      this.cart.setActiveElement(document.activeElement)
    }
    config.body = formData

    fetch(`${window.routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          this.handleErrorMessage(response.description)

          this.submitButton.setAttribute('aria-disabled', true)
          this.error = true
          return
        }

        if (!this.cart) {
          window.location = window.routes.cart_url
          return
        }

        this.error = false
        this.cart.renderContents(response)
      })
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        this.submitButton.classList.remove('loading')
        if (this.cart && this.cart.classList.contains('is-empty'))
          this.cart.classList.remove('is-empty')
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
