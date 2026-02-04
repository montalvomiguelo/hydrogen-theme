import CartItems from "@theme/cart-items";
var CartDrawerItems = class extends CartItems {
	getSectionsToRender() {
		return [{
			id: "CartDrawer",
			section: "cart-drawer",
			selector: "[tabindex=\"-1\"]"
		}, {
			id: "cart-icon-bubble",
			section: "cart-icon-bubble",
			selector: ".shopify-section"
		}];
	}
};
window.customElements.define("cart-drawer-items", CartDrawerItems);
