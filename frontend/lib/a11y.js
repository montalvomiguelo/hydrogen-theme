export function onKeyUpEscape (event) {
  if (event.code.toUpperCase() !== 'ESCAPE') return

  const openDetailsElement = event.target.closest('details[open]')
  if (!openDetailsElement) return

  const summaryElement = openDetailsElement.querySelector('summary')
  openDetailsElement.removeAttribute('open')
  summaryElement.setAttribute('aria-expanded', false)
  summaryElement.focus()
}
