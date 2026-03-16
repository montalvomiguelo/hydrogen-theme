import DetailsModal from "@theme/details-modal";
//#region frontend/islands/password-modal.js
var PasswordModal = class extends DetailsModal {
	constructor() {
		super();
		if (this.querySelector("input[aria-invalid=\"true\"]")) this.open({ target: this.querySelector("details") });
	}
};
window.customElements.define("password-modal", PasswordModal);
//#endregion
