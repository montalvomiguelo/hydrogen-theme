function media ({ query }) {
  const mediaQuery = window.matchMedia(query)
  return new Promise(function (resolve) {
    if (mediaQuery.matches) {
      resolve(true)
    } else {
      mediaQuery.addEventListener('change', resolve, { once: true })
    }
  })
}

function visible ({ element }) {
  return new Promise(function (resolve) {
    const observer = new window.IntersectionObserver(async function (entries) {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          observer.disconnect()
          resolve(true)
          break
        }
      }
    })
    observer.observe(element)
  })
}

function iddle () {
  return new Promise(function (resolve) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(resolve)
    } else {
      setTimeout(resolve, 200)
    }
  })
}

export default function revive (islands) {
  const knownJsSrcRE = /([^/\\]+)\.((j|t)sx?|m[jt]s|vue|marko|svelte|astro)($|\?)/
  const paths = Object.keys(islands)
  const observer = new window.MutationObserver(mutations => {
    for (let i = 0; i < mutations.length; i++) {
      const { addedNodes } = mutations[i]
      for (let i = 0; i < addedNodes.length; i++) {
        const node = addedNodes[i]

        if (node.nodeType === 1) walk(node)
      }
    }
  })

  async function walk (node) {
    const path = paths.find(path => {
      const tagName = node.tagName
      const name = path.match(knownJsSrcRE)[1].toUpperCase()
      return name === tagName
    })

    if (path) {
      if (node.hasAttribute('client:visible')) {
        await visible({ element: node })
      }

      const clientMedia = node.getAttribute('client:media')
      if (clientMedia) {
        await media({ query: clientMedia })
      }

      if (node.hasAttribute('client:iddle')) {
        await iddle()
      }

      islands[path]()
    }

    const nextSibling = node.nextElementSibling
    const firstChild = node.firstElementChild

    if (nextSibling) walk(nextSibling)
    if (firstChild) walk(firstChild)
  }

  walk(document.body)

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}
