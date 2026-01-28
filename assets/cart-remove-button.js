var CartRemoveButton = class extends window.HTMLElement {
	constructor() {
		super();
		this.addEventListener("click", (event) => {
			event.preventDefault();
			(this.closest("cart-items") || this.closest("cart-drawer-items")).updateQuantity(this.dataset.index, 0);
		});
	}
};
window.customElements.define("cart-remove-button", CartRemoveButton);
