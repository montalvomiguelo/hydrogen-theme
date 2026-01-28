import { n as fetchConfig } from "@theme/utils";
var CartNote = class extends window.HTMLElement {
	constructor() {
		super();
		this.addEventListener("change", (event) => {
			event.stopPropagation();
			const body = JSON.stringify({ note: event.target.value });
			fetch(`${window.routes.cart_update_url}`, {
				...fetchConfig(),
				body
			});
		});
	}
};
window.customElements.define("cart-note", CartNote);
