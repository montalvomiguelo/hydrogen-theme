# Cart Global Events Implementation Plan

This document outlines the plan to refactor cart components to use a global event pattern, decoupling components and enabling easier extension.

## Goals

- Decouple `product-form` from direct `cart-drawer` references
- Create consistent, documented cart event lifecycle
- Enable future components to react to cart changes without modifying existing code
- Maintain backwards compatibility during transition

## Event Naming Convention

All cart events will be namespaced with `cart:` prefix and use past/present tense to indicate lifecycle:

| Event | When Fired | Detail Payload |
|-------|------------|----------------|
| `cart:adding` | Before add-to-cart API call | `{ productId, variantId, quantity, form }` |
| `cart:added` | After successful add | `{ productId, variantId, cart, sections }` |
| `cart:updating` | Before quantity/note change | `{ line, quantity }` |
| `cart:updated` | After successful update | `{ cart, sections }` |
| `cart:removing` | Before item removal | `{ line }` |
| `cart:removed` | After item removed | `{ cart, sections }` |
| `cart:error` | On any cart API error | `{ error, action }` |

## New File Structure

```
frontend/
├── lib/
│   ├── cart-events.js    # NEW: Event dispatch helpers
│   └── ...
├── islands/
│   ├── product-form.js   # MODIFY: Dispatch events instead of direct calls
│   ├── cart-drawer.js    # MODIFY: Listen for events to open/render
│   ├── cart-items.js     # MODIFY: Dispatch events on updates
│   └── ...
```

## Implementation Details

### Step 1: Create cart-events.js

Create a lightweight helper module for dispatching cart events with consistent structure.

**File:** `frontend/lib/cart-events.js`

```javascript
/**
 * Dispatches a cart event on the document
 * @param {string} name - Event name without 'cart:' prefix
 * @param {object} detail - Event payload
 */
export function dispatchCartEvent(name, detail = {}) {
  document.dispatchEvent(
    new CustomEvent(`cart:${name}`, {
      detail,
      bubbles: true
    })
  )
}

/**
 * Subscribe to a cart event
 * @param {string} name - Event name without 'cart:' prefix
 * @param {function} callback - Handler function
 * @returns {function} Unsubscribe function
 */
export function onCartEvent(name, callback) {
  const handler = (event) => callback(event.detail)
  document.addEventListener(`cart:${name}`, handler)
  return () => document.removeEventListener(`cart:${name}`, handler)
}
```

### Step 2: Modify product-form.js

Remove direct `cart-drawer` reference. Dispatch events instead.

**Changes:**
- Remove `this.cart = document.querySelector('cart-drawer')`
- Dispatch `cart:adding` before fetch
- Dispatch `cart:added` on success with sections data
- Dispatch `cart:error` on failure

**Before:**
```javascript
this.cart.renderContents(response)
```

**After:**
```javascript
dispatchCartEvent('added', {
  productId: this.productId,
  variantId: formData.get('id'),
  cart: response,
  sections: response.sections
})
```

### Step 3: Modify cart-drawer.js

Listen for `cart:added` event to open and render.

**Changes:**
- Add event listener in constructor for `cart:added`
- Keep `renderContents()` method but call it from event handler
- Remove dependency on being called directly by other components

**Add to constructor:**
```javascript
document.addEventListener('cart:added', (event) => {
  this.renderContents(event.detail)
  this.open()
})
```

### Step 4: Modify cart-items.js

Dispatch events during quantity updates.

**Changes:**
- Dispatch `cart:updating` before API call in `updateQuantity()`
- Dispatch `cart:updated` after successful response
- Dispatch `cart:error` in catch block

### Step 5: Modify cart-remove-button.js

Dispatch removal-specific event.

**Changes:**
- Dispatch `cart:removing` before calling `updateQuantity(index, 0)`
- Parent `cart-items` will dispatch `cart:updated` after completion

### Step 6: Update Documentation

Update `docs/cart-drawer.md` to document the new event system and how to subscribe to events.

## Migration Path

1. Add `cart-events.js` helper module
2. Update `product-form.js` to dispatch events (keep direct call temporarily)
3. Update `cart-drawer.js` to listen for events
4. Remove direct coupling from `product-form.js`
5. Update remaining cart components
6. Update documentation

## Usage Examples

### Listening for cart updates (future component)

```javascript
import { onCartEvent } from '@/lib/cart-events'

class CartNotification extends HTMLElement {
  constructor() {
    super()
    onCartEvent('added', ({ cart }) => {
      this.show(`Added to cart! (${cart.item_count} items)`)
    })
  }
}
```

### Analytics integration

```javascript
document.addEventListener('cart:added', (event) => {
  analytics.track('Product Added', {
    product_id: event.detail.productId,
    variant_id: event.detail.variantId
  })
})
```

### Custom upsell component

```javascript
document.addEventListener('cart:updated', (event) => {
  const { cart } = event.detail
  if (cart.total_price > 5000) {
    upsellModal.hide() // Hide upsell if threshold met
  }
})
```

## Files to Modify

| File | Change Type |
|------|-------------|
| `frontend/lib/cart-events.js` | Create |
| `frontend/islands/product-form.js` | Modify |
| `frontend/islands/cart-drawer.js` | Modify |
| `frontend/islands/cart-items.js` | Modify |
| `frontend/islands/cart-drawer-items.js` | Minor (inherits from cart-items) |
| `frontend/islands/cart-remove-button.js` | Modify |
| `frontend/entrypoints/theme.js` | Possibly add global event import |
| `docs/cart-drawer.md` | Update |

## Open Questions

1. **Should `cart:added` include the full cart object or just the added item?**
   - Recommendation: Include both - the added item details and the full cart state

2. **Should we dispatch events for cart note changes?**
   - Recommendation: Yes, add `cart:note-updated` for consistency

3. **Should events fire on page load with initial cart state?**
   - Recommendation: No, only on user actions. Components can read initial state from Liquid.
