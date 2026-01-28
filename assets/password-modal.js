import DetailsModal from "@theme/details-modal";
var PasswordModal = class extends DetailsModal {
	constructor() {
		super();
		if (this.querySelector("input[aria-invalid=\"true\"]")) this.open({ target: this.querySelector("details") });
	}
};
window.customElements.define("password-modal", PasswordModal);
