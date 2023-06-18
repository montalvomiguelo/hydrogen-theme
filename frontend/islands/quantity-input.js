class QuantityInput extends window.HTMLElement {
  constructor() {
    super()
    this.input = this.querySelector('input')
    this.changeEvent = new Event('change', { bubbles: true })

    this.querySelectorAll('button').forEach((button) =>
      button.addEventListener('click', this.onButtonClick.bind(this))
    )
  }

  onButtonClick(event) {
    event.preventDefault()
    const previousValue = this.input.value

    event.target.name === 'plus' ? this.input.stepUp() : this.input.stepDown()
    if (previousValue !== this.input.value)
      this.input.dispatchEvent(this.changeEvent)
  }
}

window.customElements.define('quantity-input', QuantityInput)
