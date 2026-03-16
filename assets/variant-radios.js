import VariantSelects from "@theme/variant-selects";
//#region frontend/islands/variant-radios.js
var VariantRadios = class extends VariantSelects {
	updateOptions() {
		this.options = Array.from(this.querySelectorAll("fieldset")).map((fieldset) => {
			return Array.from(fieldset.querySelectorAll("input")).find((radio) => radio.checked).value;
		});
	}
};
window.customElements.define("variant-radios", VariantRadios);
//#endregion
