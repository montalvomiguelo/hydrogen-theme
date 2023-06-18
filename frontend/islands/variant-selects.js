export default class VariantSelects extends window.HTMLElement {
  constructor() {
    super()
    this.addEventListener('change', this.onVariantChange)
  }

  onVariantChange() {
    this.updateOptions()
    this.updateMasterId()
    this.toggleAddButton(true, '', false)
    this.removeErrorMessage()

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true)
      this.setUnavailable()
    } else {
      this.updateURL()
      this.updateVariantInput()
      this.renderProductInfo()
    }
  }

  updateOptions() {
    this.options = Array.from(
      this.querySelectorAll('select'),
      (select) => select.value
    )
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option
        })
        .includes(false)
    })
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === 'false') return
    window.history.replaceState(
      {},
      '',
      `${this.dataset.url}?variant=${this.currentVariant.id}`
    )
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`
    )
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]')
      input.value = this.currentVariant.id
      input.dispatchEvent(new Event('change', { bubbles: true }))
    })
  }

  removeErrorMessage() {
    const section = this.closest('section')
    if (!section) return

    const productForm = section.querySelector('product-form')
    if (productForm) productForm.handleErrorMessage()
  }

  renderProductInfo() {
    fetch(
      `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${
        this.dataset.originalSection
          ? this.dataset.originalSection
          : this.dataset.section
      }`
    )
      .then((response) => response.text())
      .then((responseText) => {
        const html = new window.DOMParser().parseFromString(
          responseText,
          'text/html'
        )
        const destination = document.getElementById(
          `price-${this.dataset.section}`
        )
        const source = html.getElementById(
          `price-${
            this.dataset.originalSection
              ? this.dataset.originalSection
              : this.dataset.section
          }`
        )
        if (source && destination) destination.innerHTML = source.innerHTML

        const price = document.getElementById(`price-${this.dataset.section}`)

        if (price) price.classList.remove('invisible')
        this.toggleAddButton(
          !this.currentVariant.available,
          window.variantStrings.soldOut
        )
      })
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(
      `product-form-${this.dataset.section}`
    )
    if (!productForm) return
    const addButton = productForm.querySelector('[name="add"]')
    const addButtonText = productForm.querySelector('[name="add"] > span')
    if (!addButton) return

    if (disable) {
      addButton.setAttribute('disabled', 'disabled')
      if (text) addButtonText.textContent = text
    } else {
      addButton.removeAttribute('disabled')
      addButtonText.textContent = window.variantStrings.addToCart
    }
  }

  setUnavailable() {
    const button = document.getElementById(
      `product-form-${this.dataset.section}`
    )
    const addButton = button.querySelector('[name="add"]')
    const addButtonText = button.querySelector('[name="add"] > span')
    const price = document.getElementById(`price-${this.dataset.section}`)
    if (!addButton) return
    addButtonText.textContent = window.variantStrings.unavailable
    if (price) price.classList.add('invisible')
  }

  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent)
    return this.variantData
  }
}

window.customElements.define('variant-selects', VariantSelects)
