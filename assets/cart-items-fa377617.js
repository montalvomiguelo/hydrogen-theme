import{d as l,f as u}from"./utils-3b9fa9c2.js";import{t as m}from"./theme-d2865bdb.js";import"./modulepreload-polyfill-da3817bc.js";class g extends window.HTMLElement{constructor(){super(),this.lineItemStatusElement=document.getElementById("shopping-cart-line-item-status")||document.getElementById("CartDrawer-LineItemStatus"),this.currentItemCount=Array.from(this.querySelectorAll('[name="updates[]"]')).reduce((e,r)=>e+parseInt(r.value),0),this.debouncedOnChange=l(e=>{this.onChange(e)},300),this.addEventListener("change",this.debouncedOnChange)}onChange(e){this.updateQuantity(e.target.dataset.index,e.target.value,document.activeElement.getAttribute("name"))}getSectionsToRender(){return[{id:"main-cart-items",section:document.getElementById("main-cart-items").dataset.id,selector:".js-contents"},{id:"cart-icon-bubble",section:"cart-icon-bubble",selector:".shopify-section"},{id:"cart-live-region-text",section:"cart-live-region-text",selector:".shopify-section"},{id:"cart-subtotal",section:"cart-subtotal",selector:".shopify-section"}]}updateQuantity(e,r,a){this.enableLoading(e);const o=JSON.stringify({line:e,quantity:r,sections:this.getSectionsToRender().map(t=>t.section),sections_url:window.location.pathname});fetch(`${window.routes.cart_change_url}`,{...u(),body:o}).then(t=>t.text()).then(t=>{const i=JSON.parse(t);this.classList.toggle("is-empty",i.item_count===0);const n=document.querySelector("cart-drawer");n&&n.classList.toggle("is-empty",i.item_count===0),this.getSectionsToRender().forEach(s=>{const d=document.getElementById(s.id).querySelector(s.selector)||document.getElementById(s.id);d.innerHTML=this.getSectionInnerHTML(i.sections[s.section],s.selector)}),this.updateLiveRegions(e,i.item_count);const c=document.getElementById(`CartItem-${e}`)||document.getElementById(`CartDrawer-Item-${e}`);c&&c.querySelector(`[name="${a}"]`)?n?m(n,c.querySelector(`[name="${a}"]`)):c.querySelector(`[name="${a}"]`).focus():i.item_count===0&&n?m(n.querySelector("#CartDrawer"),n.querySelector('[tabindex="-1"]')):document.querySelector(".cart-item")&&n&&m(n,document.querySelector(".cart-item-name")),this.disableLoading()}).catch(()=>{this.querySelectorAll(".loading-overlay").forEach(i=>i.classList.add("hidden"));const t=document.getElementById("cart-errors")||document.getElementById("CartDrawer-CartErrors");t.textContent=window.cartStrings.error,this.disableLoading()})}updateLiveRegions(e,r){if(this.currentItemCount===r){const o=document.getElementById(`Line-item-error-${e}`)||document.getElementById(`CartDrawer-LineItemError-${e}`),t=document.getElementById(`Quantity-${e}`)||document.getElementById(`Drawer-quantity-${e}`);o.innerHTML=window.cartStrings.quantityError.replace("[quantity]",t.value)}this.currentItemCount=r,this.lineItemStatusElement.setAttribute("aria-hidden",!0);const a=document.getElementById("cart-live-region-text")||document.getElementById("CartDrawer-LiveRegionText");a.setAttribute("aria-hidden",!1),setTimeout(()=>{a.setAttribute("aria-hidden",!0)},1e3)}getSectionInnerHTML(e,r){return new window.DOMParser().parseFromString(e,"text/html").querySelector(r).innerHTML}enableLoading(e){(document.getElementById("main-cart-items")||document.getElementById("CartDrawer-CartItems")).classList.add("loading");const a=this.querySelectorAll(`#CartItem-${e} .loading-overlay`),o=this.querySelectorAll(`#CartDrawer-Item-${e} .loading-overlay`);[...a,...o].forEach(t=>t.classList.remove("hidden")),document.activeElement.blur(),this.lineItemStatusElement.setAttribute("aria-hidden",!1)}disableLoading(){(document.getElementById("main-cart-items")||document.getElementById("CartDrawer-CartItems")).classList.remove("loading")}}window.customElements.define("cart-items",g);export{g as default};
