import CartItems from './cart-items'

class CartDrawerItems extends CartItems {
  getSectionsToRender () {
    return [
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '[tabindex="-1"]'
      }
    ]
  }
}

window.customElements.define('cart-drawer-items', CartDrawerItems)
