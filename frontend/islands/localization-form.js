class LocalizationForm extends window.HTMLElement {
  constructor() {
    super()
    this.elements = {
      input: this.querySelector(
        'input[name="language_code"], input[name="country_code"]'
      ),
      button: this.querySelector('button'),
      list: this.querySelector('ul')
    }
    this.elements.button.addEventListener('click', this.toggleList.bind(this))
    this.elements.button.addEventListener(
      'focusout',
      this.onButtonFocusOut.bind(this)
    )
    this.elements.list.addEventListener(
      'focusout',
      this.onListFocusOut.bind(this)
    )
    this.addEventListener('keyup', this.onLocalizationFormKeyUp.bind(this))

    this.querySelectorAll('a').forEach((item) =>
      item.addEventListener('click', this.onItemClick.bind(this))
    )

    document.body.addEventListener('click', this.onBodyClick.bind(this))
  }

  hideList() {
    this.elements.button.setAttribute('aria-expanded', 'false')
    this.elements.list.setAttribute('hidden', true)
    this.elements.button.classList.remove(
      'rounded-b',
      'md:rounded-b-none',
      'md:rounded-b-none'
    )
    this.elements.button.classList.add('rounded')
  }

  onLocalizationFormKeyUp(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return

    this.hideList()
    this.elements.button.focus()
  }

  onItemClick(event) {
    event.preventDefault()
    const form = this.querySelector('form')
    this.elements.input.value = event.currentTarget.dataset.value
    if (form) form.submit()
  }

  toggleList() {
    this.elements.list.toggleAttribute('hidden')
    this.elements.button.classList.toggle('rounded-b')
    this.elements.button.classList.toggle('md:rounded-t')
    this.elements.button.classList.toggle('md:rounded-b-none')
    this.elements.button.setAttribute(
      'aria-expanded',
      (
        this.elements.button.getAttribute('aria-expanded') === 'false'
      ).toString()
    )
  }

  onButtonFocusOut(event) {
    const disclosureLostFocus = this.contains(event.relatedTarget) === false

    if (disclosureLostFocus) {
      this.hideList()
    }
  }

  onListFocusOut(event) {
    const childInFocus = event.currentTarget.contains(event.relatedTarget)
    if (!childInFocus) {
      this.hideList()
    }
  }

  onBodyClick(event) {
    const isOption = this.contains(event.target)
    const isVisible =
      this.elements.button.getAttribute('aria-expanded') === 'true'

    if (isVisible && !isOption) {
      this.hideList()
    }
  }
}

window.customElements.define('localization-form', LocalizationForm)
