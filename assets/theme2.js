(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function getFocusableElements(container) {
  const elements = Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
  return elements.filter(
    (element) => !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)
  );
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
    if (event.code.toUpperCase() !== "TAB") return;
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
  if (elementToFocus) elementToFocus.focus();
}
function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== "ESCAPE") return;
  const openDetailsElement = event.target.closest("details[open]");
  if (!openDetailsElement) return;
  const summaryElement = openDetailsElement.querySelector("summary");
  openDetailsElement.removeAttribute("open");
  summaryElement.setAttribute("aria-expanded", false);
  summaryElement.focus();
}
function initDisclosureWidgets(summaries2) {
  summaries2.forEach((summary) => {
    summary.setAttribute("role", "button");
    summary.setAttribute(
      "aria-expanded",
      summary.parentNode.hasAttribute("open")
    );
    if (summary.nextElementSibling.getAttribute("id")) {
      summary.setAttribute("aria-controls", summary.nextElementSibling.id);
    }
    summary.addEventListener("click", (event) => {
      event.currentTarget.setAttribute(
        "aria-expanded",
        !event.currentTarget.closest("details").hasAttribute("open")
      );
    });
    summary.parentElement.addEventListener("keyup", onKeyUpEscape);
  });
}
const scriptRel = "modulepreload";
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    let allSettled = function(promises$2) {
      return Promise.all(promises$2.map((p) => Promise.resolve(p).then((value$1) => ({
        status: "fulfilled",
        value: value$1
      }), (reason) => ({
        status: "rejected",
        reason
      }))));
    };
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled(deps.map((dep) => {
      dep = assetsURL(dep, importerUrl);
      if (dep in seen) return;
      seen[dep] = true;
      const isCss = dep.endsWith(".css");
      const cssSelector = isCss ? '[rel="stylesheet"]' : "";
      if (!!importerUrl) for (let i$1 = links.length - 1; i$1 >= 0; i$1--) {
        const link$1 = links[i$1];
        if (link$1.href === dep && (!isCss || link$1.rel === "stylesheet")) return;
      }
      else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
      const link = document.createElement("link");
      link.rel = isCss ? "stylesheet" : scriptRel;
      if (!isCss) link.as = "script";
      link.crossOrigin = "";
      link.href = dep;
      if (cspNonce) link.setAttribute("nonce", cspNonce);
      document.head.appendChild(link);
      if (isCss) return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
      });
    }));
  }
  function handlePreloadError(err$2) {
    const e$1 = new Event("vite:preloadError", { cancelable: true });
    e$1.payload = err$2;
    window.dispatchEvent(e$1);
    if (!e$1.defaultPrevented) throw err$2;
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
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
const islands = /* @__PURE__ */ Object.assign({ "/frontend/islands/cart-drawer-items.js": () => __vitePreload(() => import("@theme/cart-drawer-items"), true ? [] : void 0, import.meta.url), "/frontend/islands/cart-drawer.js": () => __vitePreload(() => import("@theme/cart-drawer"), true ? [] : void 0, import.meta.url), "/frontend/islands/cart-items.js": () => __vitePreload(() => import("@theme/cart-items"), true ? [] : void 0, import.meta.url), "/frontend/islands/cart-note.js": () => __vitePreload(() => import("@theme/cart-note"), true ? [] : void 0, import.meta.url), "/frontend/islands/cart-remove-button.js": () => __vitePreload(() => import("@theme/cart-remove-button"), true ? [] : void 0, import.meta.url), "/frontend/islands/details-disclosure.js": () => __vitePreload(() => import("@theme/details-disclosure"), true ? [] : void 0, import.meta.url), "/frontend/islands/details-modal.js": () => __vitePreload(() => import("@theme/details-modal"), true ? [] : void 0, import.meta.url), "/frontend/islands/header-drawer.js": () => __vitePreload(() => import("@theme/header-drawer"), true ? [] : void 0, import.meta.url), "/frontend/islands/localization-form.js": () => __vitePreload(() => import("@theme/localization-form"), true ? [] : void 0, import.meta.url), "/frontend/islands/password-modal.js": () => __vitePreload(() => import("@theme/password-modal"), true ? [] : void 0, import.meta.url), "/frontend/islands/product-form.js": () => __vitePreload(() => import("@theme/product-form"), true ? [] : void 0, import.meta.url), "/frontend/islands/product-recommendations.js": () => __vitePreload(() => import("@theme/product-recommendations"), true ? [] : void 0, import.meta.url), "/frontend/islands/quantity-input.js": () => __vitePreload(() => import("@theme/quantity-input"), true ? [] : void 0, import.meta.url), "/frontend/islands/sticky-header.js": () => __vitePreload(() => import("@theme/sticky-header"), true ? [] : void 0, import.meta.url), "/frontend/islands/variant-radios.js": () => __vitePreload(() => import("@theme/variant-radios"), true ? [] : void 0, import.meta.url), "/frontend/islands/variant-selects.js": () => __vitePreload(() => import("@theme/variant-selects"), true ? [] : void 0, import.meta.url) });
function revive(islands2) {
  const observer = new window.MutationObserver((mutations) => {
    for (let i = 0; i < mutations.length; i++) {
      const { addedNodes } = mutations[i];
      for (let j = 0; j < addedNodes.length; j++) {
        const node = addedNodes[j];
        if (node.nodeType === 1) dfs(node);
      }
    }
  });
  async function dfs(node) {
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
    let child = node.firstElementChild;
    while (child) {
      dfs(child);
      child = child.nextElementSibling;
    }
  }
  dfs(document.body);
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
