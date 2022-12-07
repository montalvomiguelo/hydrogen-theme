# Hydrogen Shopify Theme

Hydrogen Shopify Theme is a theme framework that you can use to build Shopify themes with OS 2.0 features and performance in mind.

## Features

* ⚡️ Seamless integration with Vite
* 💄 Tailwind CSS for styling
* 🏝 Islands architecture
* ✨ Web components
* 🚀 Production-ready scores in Lighthouse and PageSpeed Insights reports

## Requirements

* [Node.js (latest LTS version)](https://nodejs.org/en/)
* [pnpm](https://pnpm.io/)
* [Shopify CLI](https://shopify.dev/themes/tools/cli)

## Directory Structure

This theme leverages the [default Shopify theme folder structure](https://shopify.dev/themes/tools/github#repository-structure) and adds 2 directories that have special behaviors.

```bash
└── project
    └── frontend
        ├── entrypoints
        │   └── # oly Vite entry files here
        └── islands
            └── # all of the interactive islands in your project
```

Look at [vite-plugin-shopify](https://github.com/barrel/barrel-shopify/tree/main/packages/vite-plugin-shopify) to learn more.

## Hydration Directives

The following hydration strategies are available (borrowed from [Astro](https://docs.astro.build/en/concepts/islands/)).

* `client:iddle` Hydrate the component as soon as the main thread is [free](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback).
* `client:visible` Hydrates the component as soon as the element [enters the viewport](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).
* `client:media` Hydrates the component as soon as the browser [matches the given media query](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia).

## Setup

```bash
# Make sure to install the dependencies
pnpm install
```

## Development Server

```bash
# Start the vite server on http://localhost:5173
pnpm dev
```

> **Note**: This server is not your theme server. It is the server that vite uses to process your assets, such as scripts or stylesheets. You still need to serve your theme using the Shopify CLI.

```bash
# Serve your theme
shopify theme dev
```

## Production

```bash
# Build your CSS and JavaScript assets for production
pnpm build
```

```bash
# Upload your local theme files to Shopify
shopify theme push
```

Checkout [Build Shopify themes](https://shopify.dev/themes) for more information.

