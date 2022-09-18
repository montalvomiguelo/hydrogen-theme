import { removeTrapFocus, trapFocus } from '@/lib/a11y'

export default class DetailsModal extends window.HTMLElement {
  constructor () {
    super()
    this.detailsContainer = this.querySelector('details')
    this.summaryToggle = this.querySelector('summary')

    this.detailsContainer.addEventListener(
      'keyup',
      (event) => event.code.toUpperCase() === 'ESCAPE' && this.close()
    )
    this.summaryToggle.addEventListener(
      'click',
      this.onSummaryClick.bind(this)
    )
    this.querySelector('button[type="button"]').addEventListener(
      'click',
      this.close.bind(this)
    )
  }

  isOpen () {
    return this.detailsContainer.hasAttribute('open')
  }

  onSummaryClick (event) {
    event.preventDefault()
    event.target.closest('details').hasAttribute('open')
      ? this.close()
      : this.open(event)
  }

  onBodyClick (event) {
    if (!this.contains(event.target) || event.target.classList.contains('modal-overlay')) this.close(false)
  }

  open (event) {
    this.onBodyClickEvent =
      this.onBodyClickEvent || this.onBodyClick.bind(this)
    event.target.closest('details').setAttribute('open', true)
    document.body.addEventListener('click', this.onBodyClickEvent)
    document.body.classList.add('overflow-hidden')

    trapFocus(
      this.detailsContainer.querySelector('[tabindex="-1"]'),
      this.detailsContainer.querySelector('input:not([type="hidden"])')
    )
  }

  close (focusToggle = true) {
    removeTrapFocus(focusToggle ? this.summaryToggle : null)
    document.body.removeEventListener('click', this.onBodyClickEvent)
    document.body.classList.remove('overflow-hidden')
    this.closeAnimation()
  }

  closeAnimation () {
    let animationStart

    const handleAnimation = time => {
      if (animationStart === undefined) {
        animationStart = time
      }
      const elapsedTime = time - animationStart

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation)
      } else {
        this.detailsContainer.removeAttribute('open')
      }
    }

    window.requestAnimationFrame(handleAnimation)
  }
}

window.customElements.define('details-modal', DetailsModal)
