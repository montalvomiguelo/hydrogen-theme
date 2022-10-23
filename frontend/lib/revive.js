export default function revive (islands) {
  const knownJsSrcRE = /([^/\\]+)\.((j|t)sx?|m[jt]s|vue|marko|svelte|astro)($|\?)/
  const paths = Object.keys(islands)

  function walk (node) {
    const tagName = node.tagName

    const path = paths.find(path => {
      const name = path.match(knownJsSrcRE)[1].toUpperCase()
      return name === tagName
    })

    if (path) {
      islands[path]()
    }

    let el = node.firstElementChild

    while (el) {
      walk(el)

      el = el.nextElementSibling
    }
  }

  walk(document.body)
}
