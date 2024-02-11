/*
 * Shopify Common JS
 *
 */
if (typeof window.Shopify === 'undefined') {
  window.Shopify = {}
}

window.Shopify.bind = function (fn, scope) {
  return function () {
    return fn.apply(scope, arguments)
  }
}

window.Shopify.setSelectorByValue = function (selector, value) {
  for (let i = 0, count = selector.options.length; i < count; i++) {
    const option = selector.options[i]
    if (value === option.value || value === option.innerHTML) {
      selector.selectedIndex = i
      return i
    }
  }
}

window.Shopify.addListener = function (target, eventName, callback) {
  target.addEventListener
    ? target.addEventListener(eventName, callback, false)
    : target.attachEvent('on' + eventName, callback)
}

window.Shopify.postLink = function (path, options) {
  options = options || {}
  const method = options.method || 'post'
  const params = options.parameters || {}

  const form = document.createElement('form')
  form.setAttribute('method', method)
  form.setAttribute('action', path)

  for (const key in params) {
    const hiddenField = document.createElement('input')
    hiddenField.setAttribute('type', 'hidden')
    hiddenField.setAttribute('name', key)
    hiddenField.setAttribute('value', params[key])
    form.appendChild(hiddenField)
  }
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}

window.Shopify.CountryProvinceSelector = function (
  countryDomid,
  provinceDomid,
  options
) {
  this.countryEl = document.getElementById(countryDomid)
  this.provinceEl = document.getElementById(provinceDomid)
  this.provinceContainer = document.getElementById(
    options.hideElement || provinceDomid
  )

  window.Shopify.addListener(
    this.countryEl,
    'change',
    window.Shopify.bind(this.countryHandler, this)
  )

  this.initCountry()
  this.initProvince()
}

window.Shopify.CountryProvinceSelector.prototype = {
  initCountry: function () {
    const value = this.countryEl.getAttribute('data-default')
    window.Shopify.setSelectorByValue(this.countryEl, value)
    this.countryHandler()
  },

  initProvince: function () {
    const value = this.provinceEl.getAttribute('data-default')
    if (value && this.provinceEl.options.length > 0) {
      window.Shopify.setSelectorByValue(this.provinceEl, value)
    }
  },

  countryHandler: function (e) {
    const opt = this.countryEl.options[this.countryEl.selectedIndex]
    const raw = opt.getAttribute('data-provinces')
    const provinces = JSON.parse(raw)

    this.clearOptions(this.provinceEl)
    if (provinces && provinces.length === 0) {
      this.provinceContainer.style.display = 'none'
    } else {
      for (let i = 0; i < provinces.length; i++) {
        const opt = document.createElement('option')
        opt.value = provinces[i][0]
        opt.innerHTML = provinces[i][1]
        this.provinceEl.appendChild(opt)
      }

      this.provinceContainer.style.display = ''
    }
  },

  clearOptions: function (selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild)
    }
  },

  setOptions: function (selector, values) {
    for (let i = 0, count = values.length; i < count; i++) {
      const opt = document.createElement('option')
      opt.value = values[i]
      opt.innerHTML = values[i]
      selector.appendChild(opt)
    }
  }
}
