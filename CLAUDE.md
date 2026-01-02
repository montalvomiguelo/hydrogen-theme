# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install                        # Install dependencies
pnpm dev -- --store <store-name>    # Run Shopify CLI + Vite dev servers in parallel
pnpm run build                      # Bundle assets with Vite
pnpm run deploy                     # Build and push theme to Shopify
pnpm lint                           # ESLint check
pnpm format                         # Prettier auto-format
```

## Architecture

This is a Shopify OS 2.0 theme that ports Hydrogen's default template. It combines Liquid server-side rendering with a custom island-based hydration system for client-side interactivity.

### Frontend Structure (`/frontend`)

- **entrypoints/** - Main entry points (`theme.js`, `theme.css`)
- **islands/** - Interactive Web Components that hydrate on the client
- **lib/** - Shared utilities (hydration system, a11y helpers, fetch config)
- **styles/** - CSS organized in layers (base, components, utilities, theme tokens)

### Island Hydration System

Islands are Web Components (extend `HTMLElement`) that are lazily hydrated based on directives borrowed from Astro:

- `client:idle` - Hydrate when main thread is free (`requestIdleCallback`)
- `client:visible` - Hydrate when element enters viewport (`IntersectionObserver`)
- `client:media` - Hydrate when media query matches

Usage in Liquid:
```html
<product-form client:visible>
  <!-- Content hydrated only when scrolled into view -->
</product-form>
```

The hydration engine (`lib/revive.js`) uses `MutationObserver` to detect custom elements and dynamically imports their modules from `islands/`.

### Island Pattern

All islands follow this structure:
```javascript
class MyIsland extends window.HTMLElement {
  constructor() {
    super()
    // Setup on hydration
  }
}
window.customElements.define('my-island', MyIsland)
```

### Shopify Theme Structure

- **templates/** - JSON templates defining section/block composition
- **sections/** - Reusable Liquid sections with `{% schema %}` configuration
- **blocks/** - Nested block components used within sections
- **snippets/** - Partials included via `{% render %}`

### Styling

Uses Tailwind CSS 4 with `@tailwindcss/vite`. Design tokens are defined as CSS custom properties in `styles/theme.css`. Classes are applied directly in Liquid/HTML.

### Path Aliases

`@/*` and `~/*` map to `frontend/*` (configured in `jsconfig.json`).

### Shopify API Integration

Islands use `window.routes` for Shopify endpoints and `fetchConfig()` from `lib/utils.js` for POST requests to the cart API.
