import { n as trapFocus, t as removeTrapFocus } from "@theme/theme";
import DetailsModal from "@theme/details-modal";
var HeaderDrawer = class extends DetailsModal {
	open(event) {
		setTimeout(() => {
			this.detailsContainer.classList.add("menu-opening");
		});
		this.onBodyClickEvent = this.onBodyClickEvent || this.onBodyClick.bind(this);
		event.target.closest("details").setAttribute("open", true);
		document.body.addEventListener("click", this.onBodyClickEvent);
		document.body.classList.add("overflow-hidden", "lg:overflow-auto");
		trapFocus(this.detailsContainer.querySelector("[tabindex=\"-1\"]"));
	}
	close(focusToggle = true) {
		removeTrapFocus(focusToggle ? this.summaryToggle : null);
		document.body.removeEventListener("click", this.onBodyClickEvent);
		this.detailsContainer.classList.remove("menu-opening");
		document.body.classList.remove("overflow-hidden", "lg:overflow-auto");
		this.closeAnimation();
	}
	closeAnimation() {
		let animationStart;
		const handleAnimation = (time) => {
			if (animationStart === void 0) animationStart = time;
			if (time - animationStart < 400) window.requestAnimationFrame(handleAnimation);
			else this.detailsContainer.removeAttribute("open");
		};
		window.requestAnimationFrame(handleAnimation);
	}
};
window.customElements.define("header-drawer", HeaderDrawer);
