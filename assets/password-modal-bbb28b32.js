import DetailsModal from "./details-modal-088ba130.js";
import "./theme-78325941.js";
import "./modulepreload-polyfill-fef78a14.js";
class PasswordModal extends DetailsModal {
  constructor() {
    super();
    if (this.querySelector('input[aria-invalid="true"]'))
      this.open({ target: this.querySelector("details") });
  }
}
window.customElements.define("password-modal", PasswordModal);
