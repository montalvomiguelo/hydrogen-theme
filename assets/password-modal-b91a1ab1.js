import DetailsModal from "./details-modal-11938db0.js";
import "./theme-09a6ee05.js";
import "./modulepreload-polyfill-fef78a14.js";
class PasswordModal extends DetailsModal {
  constructor() {
    super();
    if (this.querySelector('input[aria-invalid="true"]'))
      this.open({ target: this.querySelector("details") });
  }
}
window.customElements.define("password-modal", PasswordModal);
