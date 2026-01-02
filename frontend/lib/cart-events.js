/**
 * Cart Events
 *
 * Global event system for cart interactions. Enables loose coupling
 * between cart components and allows external code to react to cart changes.
 *
 * Events:
 * - cart:adding    - Before add-to-cart API call
 * - cart:added     - After successful add
 * - cart:updating  - Before quantity/note change
 * - cart:updated   - After successful update
 * - cart:removing  - Before item removal
 * - cart:removed   - After item removed
 * - cart:error     - On any cart API error
 * - cart:note-updated - After cart note change
 */

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
 * @param {function} callback - Handler function receiving event detail
 * @returns {function} Unsubscribe function
 */
export function onCartEvent(name, callback) {
  const handler = (event) => callback(event.detail)
  document.addEventListener(`cart:${name}`, handler)
  return () => document.removeEventListener(`cart:${name}`, handler)
}
