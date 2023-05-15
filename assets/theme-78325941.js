import { _ as __vitePreload } from "./modulepreload-polyfill-fef78a14.js";
function getFocusableElements(container) {
  const elements = Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
  return elements.filter((element) => !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length));
}
const trapFocusHandlers = {};
function trapFocus(container, elementToFocus = container) {
  const elements = getFocusableElements(container);
  const first = elements[0];
  const last = elements[elements.length - 1];
  removeTrapFocus();
  trapFocusHandlers.focusin = (event) => {
    if (event.target !== container && event.target !== last && event.target !== first) {
      return;
    }
    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };
  trapFocusHandlers.focusout = function() {
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
  };
  trapFocusHandlers.keydown = function(event) {
    if (event.code.toUpperCase() !== "TAB")
      return;
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }
    if ((event.target === container || event.target === first) && event.shiftKey) {
      event.preventDefault();
      last.focus();
    }
  };
  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);
  elementToFocus.focus();
}
function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);
  if (elementToFocus)
    elementToFocus.focus();
}
function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== "ESCAPE")
    return;
  const openDetailsElement = event.target.closest("details[open]");
  if (!openDetailsElement)
    return;
  const summaryElement = openDetailsElement.querySelector("summary");
  openDetailsElement.removeAttribute("open");
  summaryElement.setAttribute("aria-expanded", false);
  summaryElement.focus();
}
function initDisclosureWidgets(summaries2) {
  summaries2.forEach((summary) => {
    summary.setAttribute("role", "button");
    summary.setAttribute("aria-expanded", summary.parentNode.hasAttribute("open"));
    if (summary.nextElementSibling.getAttribute("id")) {
      summary.setAttribute("aria-controls", summary.nextElementSibling.id);
    }
    summary.addEventListener("click", (event) => {
      event.currentTarget.setAttribute("aria-expanded", !event.currentTarget.closest("details").hasAttribute("open"));
    });
    summary.parentElement.addEventListener("keyup", onKeyUpEscape);
  });
}
function media({ query }) {
  const mediaQuery = window.matchMedia(query);
  return new Promise(function(resolve) {
    if (mediaQuery.matches) {
      resolve(true);
    } else {
      mediaQuery.addEventListener("change", resolve, { once: true });
    }
  });
}
function visible({ element }) {
  return new Promise(function(resolve) {
    const observer = new window.IntersectionObserver(async function(entries) {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          observer.disconnect();
          resolve(true);
          break;
        }
      }
    });
    observer.observe(element);
  });
}
function idle() {
  return new Promise(function(resolve) {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(resolve);
    } else {
      setTimeout(resolve, 200);
    }
  });
}
const islands = /* @__PURE__ */ Object.assign({ "/frontend/islands/cart-drawer-items.js": () => __vitePreload(() => import("./cart-drawer-items-2f38a5d2.js"), true ? ["./cart-drawer-items-2f38a5d2.js","./cart-items-5b631311.js","./utils-df16e8d7.js","./modulepreload-polyfill-fef78a14.js"] : void 0, import.meta.url), "/frontend/islands/cart-drawer.js": () => __vitePreload(() => import("./cart-drawer-b9e53fb8.js"), true ? ["./cart-drawer-b9e53fb8.js","./modulepreload-polyfill-fef78a14.js"] : void 0, import.meta.url), "/frontend/islands/cart-items.js": () => __vitePreload(() => import("./cart-items-5b631311.js"), true ? ["./cart-items-5b631311.js","./utils-df16e8d7.js","./modulepreload-polyfill-fef78a14.js"] : void 0, import.meta.url), "/frontend/islands/cart-note.js": () => __vitePreload(() => import("./cart-note-58aed792.js"), true ? ["./cart-note-58aed792.js","./utils-df16e8d7.js"] : void 0, import.meta.url), "/frontend/islands/cart-remove-button.js": () => __vitePreload(() => import("./cart-remove-button-a489fff0.js"), true ? [] : void 0, import.meta.url), "/frontend/islands/details-disclosure.js": () => __vitePreload(() => import("./details-disclosure-5e84344b.js"), true ? [] : void 0, import.meta.url), "/frontend/islands/details-modal.js": () => __vitePreload(() => import("./details-modal-088ba130.js"), true ? ["./details-modal-088ba130.js","./modulepreload-polyfill-fef78a14.js"] : void 0, import.meta.url), "/frontend/islands/header-drawer.js": () => __vitePreload(() => import("./header-drawer-3b44af47.js"), true ? ["./header-drawer-3b44af47.js","./details-modal-088ba130.js","./modulepreload-polyfill-fef78a14.js"] : void 0, import.meta.url), "/frontend/islands/localization-form.js": () => __vitePreload(() => import("./localization-form-6590d1f7.js"), true ? [] : void 0, import.meta.url), "/frontend/islands/password-modal.js": () => __vitePreload(() => import("./password-modal-bbb28b32.js"), true ? ["./password-modal-bbb28b32.js","./details-modal-088ba130.js","./modulepreload-polyfill-fef78a14.js"] : void 0, import.meta.url), "/frontend/islands/product-form.js": () => __vitePreload(() => import("./product-form-b264aca7.js"), true ? ["./product-form-b264aca7.js","./utils-df16e8d7.js"] : void 0, import.meta.url), "/frontend/islands/product-recommendations.js": () => __vitePreload(() => import("./product-recommendations-9ed47de3.js"), true ? [] : void 0, import.meta.url), "/frontend/islands/quantity-input.js": () => __vitePreload(() => import("./quantity-input-a24be177.js"), true ? [] : void 0, import.meta.url), "/frontend/islands/sticky-header.js": () => __vitePreload(() => import("./sticky-header-e94b714c.js"), true ? [] : void 0, import.meta.url), "/frontend/islands/variant-radios.js": () => __vitePreload(() => import("./variant-radios-3a6327f6.js"), true ? ["./variant-radios-3a6327f6.js","./variant-selects-403a5c9a.js"] : void 0, import.meta.url), "/frontend/islands/variant-selects.js": () => __vitePreload(() => import("./variant-selects-403a5c9a.js"), true ? [] : void 0, import.meta.url) });
function revive(islands2) {
  const observer = new window.MutationObserver((mutations) => {
    for (let i = 0; i < mutations.length; i++) {
      const { addedNodes } = mutations[i];
      for (let i2 = 0; i2 < addedNodes.length; i2++) {
        const node = addedNodes[i2];
        if (node.nodeType === 1)
          walk(node);
      }
    }
  });
  async function walk(node) {
    const tagName = node.tagName.toLowerCase();
    const potentialJsPath = `/frontend/islands/${tagName}.js`;
    const isPotentialCustomElementName = /-/.test(tagName);
    if (isPotentialCustomElementName && islands2[potentialJsPath]) {
      if (node.hasAttribute("client:visible")) {
        await visible({ element: node });
      }
      const clientMedia = node.getAttribute("client:media");
      if (clientMedia) {
        await media({ query: clientMedia });
      }
      if (node.hasAttribute("client:idle")) {
        await idle();
      }
      islands2[potentialJsPath]();
    }
    const sibling = node.nextElementSibling;
    const firstChild = node.firstElementChild;
    if (sibling)
      walk(sibling);
    if (firstChild)
      walk(firstChild);
  }
  walk(document.body);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
const summaries = document.querySelectorAll('[id^="Details-"] summary');
revive(islands);
initDisclosureWidgets(summaries);
export {
  removeTrapFocus as r,
  trapFocus as t
};
