const d="modulepreload",m=function(u,n){return new URL(u,n).href},f={},y=function(n,o,i){if(!o||o.length===0)return n();const t=document.getElementsByTagName("link");return Promise.all(o.map(e=>{if(e=m(e,i),e in f)return;f[e]=!0;const r=e.endsWith(".css"),a=r?'[rel="stylesheet"]':"";if(!!i)for(let c=t.length-1;c>=0;c--){const l=t[c];if(l.href===e&&(!r||l.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${e}"]${a}`))return;const s=document.createElement("link");if(s.rel=r?"stylesheet":d,r||(s.as="script",s.crossOrigin=""),s.href=e,document.head.appendChild(s),r)return new Promise((c,l)=>{s.addEventListener("load",c),s.addEventListener("error",()=>l(new Error(`Unable to preload CSS for ${e}`)))})})).then(()=>n())};(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const r of e.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function o(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function i(t){if(t.ep)return;t.ep=!0;const e=o(t);fetch(t.href,e)}})();export{y as _};
