class LocalizationForm extends window.HTMLElement {
  constructor () {
    super()
    this.elements = {
      input: this.querySelector('input[name="language_code"], input[name="country_code"]'),
      button: this.querySelector('button'),
      icon: this.querySelector('svg'),
      panel: this.querySelector('ul')
    }
    this.elements.button.addEventListener('click', this.openSelector.bind(this))
    this.elements.button.addEventListener('focusout', this.closeSelector.bind(this))
    this.addEventListener('keyup', this.onContainerKeyUp.bind(this))

    this.querySelectorAll('a').forEach(item => item.addEventListener('click', this.onItemClick.bind(this)))
  }

  hidePanel () {
    this.elements.button.setAttribute('aria-expanded', 'false')
    this.elements.panel.setAttribute('hidden', true)
    this.elements.button.classList.remove('rounded-b', 'md:rounded-b-none', 'md:rounded-b-none')
    this.elements.button.classList.add('rounded')
    this.elements.icon.classList.remove('rotate-180')
  }

  onContainerKeyUp (event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return

    this.hidePanel()
    this.elements.button.focus()
  }

  onItemClick (event) {
    event.preventDefault()
    const form = this.querySelector('form')
    this.elements.input.value = event.currentTarget.dataset.value
    if (form) form.submit()
  }

  openSelector () {
    this.elements.button.focus()
    this.elements.panel.toggleAttribute('hidden')
    this.elements.button.classList.toggle('rounded-b')
    this.elements.button.classList.toggle('md:rounded-t')
    this.elements.button.classList.toggle('md:rounded-b-none')
    this.elements.icon.classList.toggle('rotate-180')
    this.elements.button.setAttribute('aria-expanded', (this.elements.button.getAttribute('aria-expanded') === 'false').toString())
  }

  closeSelector (event) {
    const shouldClose = event.relatedTarget && event.relatedTarget.nodeName === 'BUTTON'
    if (event.relatedTarget === null || shouldClose) {
      this.hidePanel()
    }
  }
}

window.customElements.define('localization-form', LocalizationForm)
