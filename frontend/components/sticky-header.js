import { isHome } from '@/lib/utils'

class StickyHeader extends window.HTMLElement {
  constructor () {
    super()

    this.header = this.querySelector('header')
  }

  connectedCallback () {
    if (!isHome) {
      window.addEventListener('scroll', this.onScroll.bind(this))
    }
  }

  onScroll () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > 50) {
      this.header.classList.add('shadow-lightHeader')
    } else {
      this.header.classList.remove('shadow-lightHeader')
    }
  }
}

window.customElements.define('sticky-header', StickyHeader)
