class CartRemoveButton extends window.HTMLElement {
  constructor() {
    super()
    this.addEventListener('click', (event) => {
      event.preventDefault()
      const cartItems =
        this.closest('cart-items') || this.closest('cart-drawer-items')
      cartItems.updateQuantity(this.dataset.index, 0)
    })
  }
}

window.customElements.define('cart-remove-button', CartRemoveButton)
