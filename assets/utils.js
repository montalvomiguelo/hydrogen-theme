function fetchConfig(type = "json") {
	return {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: `application/${type}`
		}
	};
}
function debounce(fn, wait) {
	let t;
	return (...args) => {
		clearTimeout(t);
		t = setTimeout(() => fn.apply(this, args), wait);
	};
}
export { fetchConfig as n, debounce as t };
