class DetailsDisclosure extends window.HTMLElement {
  constructor () {
    super()

    this.button = this.querySelector('button')
    this.controlFor = this.button.getAttribute('aria-controls')
    this.panel = document.getElementById(this.controlFor)

    this.button.addEventListener('click', this.onButtonClick.bind(this))
  }

  onButtonClick (event) {
    event.preventDefault()

    const isExpanded = this.button.getAttribute('aria-expanded') === 'true'

    this.panel.classList.toggle('hidden')

    this.button.setAttribute('aria-expanded', !isExpanded)
  }
}

window.customElements.define('details-disclosure', DetailsDisclosure)
