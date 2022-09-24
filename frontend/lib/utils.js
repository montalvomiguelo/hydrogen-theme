export const isHome = window.location.pathname === '/'

export function fetchConfig (type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: `application/${type}` }
  }
}
