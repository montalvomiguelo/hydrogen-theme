# Cart Drawer (Mini Cart)

The cart drawer is a slide-out panel that displays the customer's cart contents without navigating away from the current page. It opens from the right side of the viewport when a customer clicks the cart icon or adds a product to their cart.

## Architecture Overview

The cart drawer uses a component hierarchy of Web Components (custom elements) that communicate via DOM events and Shopify's Section Rendering API.

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
- Provides `renderContents()` method called by `product-form` after add-to-cart

**Key Methods:**
- `open(triggeredBy)` - Opens drawer, stores triggering element for focus return
- `close()` - Closes drawer, returns focus to triggering element
- `renderContents(parsedState)` - Re-renders drawer content after cart changes
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
- `updateQuantity(line, quantity, name)` - Updates item quantity via API
- `getSectionsToRender()` - Override in subclasses to specify which sections to re-render
- `enableLoading(line)` / `disableLoading()` - Toggle loading UI state

### Supporting Components

**quantity-input**: Wraps +/- buttons and input field. Dispatches `change` event when value changes.

**cart-remove-button**: Calls `cartItems.updateQuantity(index, 0)` to remove item.

**cart-note**: Persists note to `/cart/update.js` on textarea change.

## Data Flow

### Adding a Product (product-form.js)

1. `product-form` intercepts form submit
2. POSTs to `/cart/add.js` with form data + sections to render
3. On success, calls `cart-drawer.renderContents(response)`
4. `renderContents()` updates drawer HTML and opens the drawer

### Updating Quantity

1. User clicks +/- or edits quantity input
2. `quantity-input` dispatches `change` event
3. `cart-drawer-items` receives event (debounced 300ms)
4. `updateQuantity()` POSTs to `/cart/change.js`
5. Response includes re-rendered section HTML
6. DOM is updated, focus is managed, loading state removed

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

## Extending the Cart Drawer

To add new functionality:

1. **New island component**: Create in `frontend/islands/`, extend `HTMLElement`, use `client:idle` directive
2. **Modify sections to render**: Override `getSectionsToRender()` in `cart-drawer-items.js` if you need additional sections updated
3. **Add Liquid markup**: Edit `snippets/cart-drawer.liquid` for structural changes
4. **New settings**: Add to the "Cart" section in `config/settings_schema.json`
