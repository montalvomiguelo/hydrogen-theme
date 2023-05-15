import { t as trapFocus, r as removeTrapFocus } from "./theme-09a6ee05.js";
import "./modulepreload-polyfill-fef78a14.js";
class DetailsModal extends window.HTMLElement {
  constructor() {
    super();
    this.detailsContainer = this.querySelector("details");
    this.summaryToggle = this.querySelector("summary");
    this.detailsContainer.addEventListener(
      "keyup",
      (event) => event.code.toUpperCase() === "ESCAPE" && this.close()
    );
    this.summaryToggle.addEventListener(
      "click",
      this.onSummaryClick.bind(this)
    );
    this.querySelector('button[type="button"]').addEventListener(
      "click",
      this.close.bind(this)
    );
    this.summaryToggle.setAttribute("role", "button");
  }
  isOpen() {
    return this.detailsContainer.hasAttribute("open");
  }
  onSummaryClick(event) {
    event.preventDefault();
    event.target.closest("details").hasAttribute("open") ? this.close() : this.open(event);
  }
  onBodyClick(event) {
    if (!this.contains(event.target) || event.target.classList.contains("modal-overlay"))
      this.close(false);
  }
  open(event) {
    this.onBodyClickEvent = this.onBodyClickEvent || this.onBodyClick.bind(this);
    event.target.closest("details").setAttribute("open", true);
    document.body.addEventListener("click", this.onBodyClickEvent);
    document.body.classList.add("overflow-hidden");
    trapFocus(
      this.detailsContainer.querySelector('[tabindex="-1"]'),
      this.detailsContainer.querySelector('input:not([type="hidden"])')
    );
  }
  close(focusToggle = true) {
    removeTrapFocus(focusToggle ? this.summaryToggle : null);
    this.detailsContainer.removeAttribute("open");
    document.body.removeEventListener("click", this.onBodyClickEvent);
    document.body.classList.remove("overflow-hidden");
  }
}
window.customElements.define("details-modal", DetailsModal);
export {
  DetailsModal as default
};
