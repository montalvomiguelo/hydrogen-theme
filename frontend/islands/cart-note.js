import { fetchConfig } from '@/lib/utils'
import { dispatchCartEvent } from '@/lib/cart-events'

class CartNote extends window.HTMLElement {
  constructor() {
    super()

    this.addEventListener('change', (event) => {
      event.stopPropagation()
      const note = event.target.value
      const body = JSON.stringify({ note })
      fetch(`${window.routes.cart_update_url}`, {
        ...fetchConfig(),
        ...{ body }
      })
        .then((response) => response.json())
        .then((cart) => {
          dispatchCartEvent('note-updated', { note, cart })
        })
        .catch((e) => {
          dispatchCartEvent('error', {
            error: e.message,
            action: 'note-update'
          })
        })
    })
  }
}

window.customElements.define('cart-note', CartNote)
