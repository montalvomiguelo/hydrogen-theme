var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const selectors = {
  customerAddresses: "[data-customer-addresses]",
  addressCountrySelect: "[data-address-country-select]",
  addressContainer: "[data-address]",
  toggleAddressButton: "button[aria-expanded]",
  cancelAddressButton: 'button[type="reset"]',
  deleteAddressButton: "button[data-confirm-message]"
};
const attributes = {
  expanded: "aria-expanded",
  confirmMessage: "data-confirm-message"
};
class CustomerAddresses {
  constructor() {
    __publicField(this, "_handleAddEditButtonClick", ({ currentTarget }) => {
      this._toggleExpanded(currentTarget);
    });
    __publicField(this, "_handleCancelButtonClick", ({ currentTarget }) => {
      this._toggleExpanded(
        currentTarget.closest(selectors.addressContainer).querySelector(`[${attributes.expanded}]`)
      );
    });
    __publicField(this, "_handleDeleteButtonClick", ({ currentTarget }) => {
      if (window.confirm(currentTarget.getAttribute(attributes.confirmMessage))) {
        window.Shopify.postLink(currentTarget.dataset.target, {
          parameters: { _method: "delete" }
        });
      }
    });
    this.elements = this._getElements();
    if (Object.keys(this.elements).length === 0)
      return;
    this._setupCountries();
    this._setupEventListeners();
  }
  _getElements() {
    const container = document.querySelector(selectors.customerAddresses);
    return container ? {
      container,
      addressContainer: container.querySelector(selectors.addressContainer),
      toggleButtons: document.querySelectorAll(selectors.toggleAddressButton),
      cancelButtons: container.querySelectorAll(selectors.cancelAddressButton),
      deleteButtons: container.querySelectorAll(selectors.deleteAddressButton),
      countrySelects: container.querySelectorAll(selectors.addressCountrySelect)
    } : {};
  }
  _setupCountries() {
    if (window.Shopify && window.Shopify.CountryProvinceSelector) {
      new window.Shopify.CountryProvinceSelector("AddressCountryNew", "AddressProvinceNew", {
        hideElement: "AddressProvinceContainerNew"
      });
      this.elements.countrySelects.forEach((select) => {
        const formId = select.dataset.formId;
        new window.Shopify.CountryProvinceSelector(`AddressCountry_${formId}`, `AddressProvince_${formId}`, {
          hideElement: `AddressProvinceContainer_${formId}`
        });
      });
    }
  }
  _setupEventListeners() {
    this.elements.toggleButtons.forEach((element) => {
      element.addEventListener("click", this._handleAddEditButtonClick);
    });
    this.elements.cancelButtons.forEach((element) => {
      element.addEventListener("click", this._handleCancelButtonClick);
    });
    this.elements.deleteButtons.forEach((element) => {
      element.addEventListener("click", this._handleDeleteButtonClick);
    });
  }
  _toggleExpanded(target) {
    target.setAttribute(
      attributes.expanded,
      (target.getAttribute(attributes.expanded) === "false").toString()
    );
  }
}
const customerAddress = new CustomerAddresses();
export {
  customerAddress as default
};
