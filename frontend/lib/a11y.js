export function getFocusableElements(container) {
  const elements = Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  )

  // Filter out elements that are not visible.
  // Copied from jQuery https://github.com/jquery/jquery/blob/2d4f53416e5f74fa98e0c1d66b6f3c285a12f0ce/src/css/hiddenVisibleSelectors.js
  return elements.filter(
    (element) =>
      !!(
        element.offsetWidth ||
        element.offsetHeight ||
        element.getClientRects().length
      )
  )
}

const trapFocusHandlers = {}

export function trapFocus(container, elementToFocus = container) {
  const elements = getFocusableElements(container)
  const first = elements[0]
  const last = elements[elements.length - 1]

  removeTrapFocus()

  trapFocusHandlers.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    ) {
      return
    }

    document.addEventListener('keydown', trapFocusHandlers.keydown)
  }

  trapFocusHandlers.focusout = function () {
    document.removeEventListener('keydown', trapFocusHandlers.keydown)
  }

  trapFocusHandlers.keydown = function (event) {
    if (event.code.toUpperCase() !== 'TAB') return // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault()
      first.focus()
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault()
      last.focus()
    }
  }

  document.addEventListener('focusout', trapFocusHandlers.focusout)
  document.addEventListener('focusin', trapFocusHandlers.focusin)

  elementToFocus.focus()
}

export function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener('focusin', trapFocusHandlers.focusin)
  document.removeEventListener('focusout', trapFocusHandlers.focusout)
  document.removeEventListener('keydown', trapFocusHandlers.keydown)

  if (elementToFocus) elementToFocus.focus()
}

export function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== 'ESCAPE') return

  const openDetailsElement = event.target.closest('details[open]')
  if (!openDetailsElement) return

  const summaryElement = openDetailsElement.querySelector('summary')
  openDetailsElement.removeAttribute('open')
  summaryElement.setAttribute('aria-expanded', false)
  summaryElement.focus()
}

export function initDisclosureWidgets(summaries) {
  summaries.forEach((summary) => {
    summary.setAttribute('role', 'button')
    summary.setAttribute(
      'aria-expanded',
      summary.parentNode.hasAttribute('open')
    )

    if (summary.nextElementSibling.getAttribute('id')) {
      summary.setAttribute('aria-controls', summary.nextElementSibling.id)
    }

    summary.addEventListener('click', (event) => {
      event.currentTarget.setAttribute(
        'aria-expanded',
        !event.currentTarget.closest('details').hasAttribute('open')
      )
    })

    summary.parentElement.addEventListener('keyup', onKeyUpEscape)
  })
}
