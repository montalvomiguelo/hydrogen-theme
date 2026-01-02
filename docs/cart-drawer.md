# Cart Drawer (Mini Cart)

The cart drawer is a slide-out panel that displays the customer's cart contents without navigating away from the current page. It opens from the right side of the viewport when a customer clicks the cart icon or adds a product to their cart.

## Architecture Overview

The cart drawer uses a component hierarchy of Web Components (custom elements) that communicate via a global event system and Shopify's Section Rendering API. Components are decoupled through cart events dispatched on the `document`, enabling other parts of the theme to react to cart changes without direct dependencies.

```
cart-drawer                    # Main drawer container, handles open/close
└── cart-drawer-items          # Manages cart line items and updates
    ├── quantity-input         # +/- buttons for quantity changes
    ├── cart-remove-button     # Remove item from cart
    └── cart-note              # Optional order note textarea
```

## File Structure

| File | Purpose |
|------|---------|
| `snippets/cart-drawer.liquid` | Main Liquid template with HTML structure |
| `sections/cart-drawer.liquid` | Section wrapper (renders the snippet) |
| `frontend/lib/cart-events.js` | Global cart event helpers |
| `frontend/islands/cart-drawer.js` | Drawer open/close behavior, focus management |
| `frontend/islands/cart-drawer-items.js` | Cart updates, extends `cart-items.js` |
| `frontend/islands/cart-items.js` | Base class for cart item management |
| `frontend/islands/quantity-input.js` | Quantity increment/decrement |
| `frontend/islands/cart-remove-button.js` | Item removal |
| `frontend/islands/cart-note.js` | Order note persistence |

## Component Relationships

### cart-drawer

The outer container that controls drawer visibility and manages accessibility.

**Responsibilities:**
- Opens/closes the drawer with slide animation via `.active` class
- Traps focus within the drawer when open (accessibility)
- Listens for Escape key to close
- Handles overlay click to close
- Attaches click handler to `#cart-icon-bubble` in the header
- Listens for `cart:added` event to open and render new contents

**Key Methods:**
- `open(triggeredBy)` - Opens drawer, stores triggering element for focus return
- `close()` - Closes drawer, returns focus to triggering element
- `renderContents(detail)` - Re-renders drawer content from event detail
- `getSectionsToRender()` - Returns sections to fetch via Section Rendering API

### cart-drawer-items

Extends `cart-items` base class. Manages quantity changes and cart updates within the drawer context.

**Responsibilities:**
- Listens for `change` events on quantity inputs (debounced)
- Calls Shopify's `/cart/change.js` endpoint
- Re-renders affected sections using Section Rendering API
- Manages loading states during updates
- Updates live regions for screen reader announcements

### cart-items (Base Class)

Shared logic between drawer cart and full cart page. Located at `frontend/islands/cart-items.js`.

**Key Methods:**
- `updateQuantity(line, quantity, name)` - Updates item quantity via API, dispatches `cart:updating`, `cart:updated`, `cart:removing`, `cart:removed` events
- `getSectionsToRender()` - Override in subclasses to specify which sections to re-render
- `enableLoading(line)` / `disableLoading()` - Toggle loading UI state

### Supporting Components

**quantity-input**: Wraps +/- buttons and input field. Dispatches `change` event when value changes.

**cart-remove-button**: Calls `cartItems.updateQuantity(index, 0)` to remove item.

**cart-note**: Persists note to `/cart/update.js` on textarea change, dispatches `cart:note-updated` event.

## Data Flow

### Adding a Product (product-form.js)

1. `product-form` intercepts form submit
2. Dispatches `cart:adding` event
3. POSTs to `/cart/add.js` with form data + sections to render
4. On success, dispatches `cart:added` event with cart data and sections
5. `cart-drawer` listens for `cart:added`, calls `renderContents()` and `open()`

### Updating Quantity

1. User clicks +/- or edits quantity input
2. `quantity-input` dispatches `change` event
3. `cart-drawer-items` receives event (debounced 300ms)
4. Dispatches `cart:updating` event (and `cart:removing` if quantity is 0)
5. `updateQuantity()` POSTs to `/cart/change.js`
6. Response includes re-rendered section HTML
7. DOM is updated, focus is managed, loading state removed
8. Dispatches `cart:updated` event (and `cart:removed` if item was removed)

## Theme Settings

Cart behavior is controlled via theme settings in `config/settings_schema.json`:

| Setting | Values | Description |
|---------|--------|-------------|
| `cart_type` | `drawer`, `page` | Whether to use drawer or redirect to cart page |
| `show_cart_note` | `true/false` | Display order note textarea in drawer |

The drawer only renders when `settings.cart_type == 'drawer'` (see `layout/theme.liquid`).

## Section Rendering

The cart drawer uses Shopify's [Section Rendering API](https://shopify.dev/docs/api/ajax/reference/cart#bundled-section-rendering) to efficiently update only the changed parts of the page.

Sections rendered on cart update:
- `cart-drawer` - The drawer contents
- `cart-icon-bubble` - Header cart icon with item count

## Hydration

All cart components use `client:idle` hydration directive, meaning they hydrate when the browser's main thread is free. This ensures the drawer is interactive shortly after page load without blocking initial render.

## Accessibility Features

- Focus trap within open drawer
- Focus returns to trigger element on close
- Escape key closes drawer
- ARIA attributes: `role="dialog"`, `aria-modal="true"`, `aria-label`
- Screen reader live regions for cart updates
- Keyboard-accessible quantity controls

## Global Cart Events

Cart components dispatch events on the `document` to enable loose coupling. Any component or script can listen for these events to react to cart changes.

### Event Reference

| Event | When Fired | Detail Payload |
|-------|------------|----------------|
| `cart:adding` | Before add-to-cart API call | `{ variantId, quantity, form }` |
| `cart:added` | After successful add | `{ variantId, quantity, cart, sections }` |
| `cart:updating` | Before quantity change | `{ line, quantity }` |
| `cart:updated` | After successful update | `{ cart, sections }` |
| `cart:removing` | Before item removal | `{ line }` |
| `cart:removed` | After item removed | `{ line, cart, sections }` |
| `cart:note-updated` | After note saved | `{ note, cart }` |
| `cart:error` | On any cart API error | `{ error, action }` |

### Listening to Events

```javascript
// Using the helper
import { onCartEvent } from '@/lib/cart-events'

onCartEvent('added', ({ cart }) => {
  console.log(`Cart now has ${cart.item_count} items`)
})

// Or using native API
document.addEventListener('cart:added', (event) => {
  console.log(event.detail.cart)
})
```

### Dispatching Events

```javascript
import { dispatchCartEvent } from '@/lib/cart-events'

dispatchCartEvent('added', {
  variantId: '12345',
  quantity: 1,
  cart: response,
  sections: response.sections
})
```

## Extending the Cart Drawer

To add new functionality:

1. **Listen to cart events**: Use `onCartEvent()` to react to cart changes without modifying existing components
2. **New island component**: Create in `frontend/islands/`, extend `HTMLElement`, use `client:idle` directive
3. **Modify sections to render**: Override `getSectionsToRender()` in `cart-drawer-items.js` if you need additional sections updated
4. **Add Liquid markup**: Edit `snippets/cart-drawer.liquid` for structural changes
5. **New settings**: Add to the "Cart" section in `config/settings_schema.json`
