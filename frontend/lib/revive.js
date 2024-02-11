function media({ query }) {
  const mediaQuery = window.matchMedia(query)
  return new Promise(function (resolve) {
    if (mediaQuery.matches) {
      resolve(true)
    } else {
      mediaQuery.addEventListener('change', resolve, { once: true })
    }
  })
}

function visible({ element }) {
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

function idle() {
  return new Promise(function (resolve) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(resolve)
    } else {
      setTimeout(resolve, 200)
    }
  })
}

export const islands = import.meta.glob('@/islands/*.js')

export function revive(islands) {
  const observer = new window.MutationObserver((mutations) => {
    for (let i = 0; i < mutations.length; i++) {
      const { addedNodes } = mutations[i]
      for (let j = 0; j < addedNodes.length; j++) {
        const node = addedNodes[j]
        if (node.nodeType === 1) dfs(node)
      }
    }
  })

  async function dfs(node) {
    const tagName = node.tagName.toLowerCase()
    const potentialJsPath = `/frontend/islands/${tagName}.js`
    const isPotentialCustomElementName = /-/.test(tagName)

    if (isPotentialCustomElementName && islands[potentialJsPath]) {
      if (node.hasAttribute('client:visible')) {
        await visible({ element: node })
      }

      const clientMedia = node.getAttribute('client:media')
      if (clientMedia) {
        await media({ query: clientMedia })
      }

      if (node.hasAttribute('client:idle')) {
        await idle()
      }

      islands[potentialJsPath]()
    }

    let child = node.firstElementChild

    while (child) {
      dfs(child)
      child = child.nextElementSibling
    }
  }

  dfs(document.body)

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}
