---
title: Devtools
id: devtools
---

TanStack Table provides framework-specific devtools adapters that plug into the [TanStack Devtools](https://tanstack.com/devtools) multi-panel UI.

The table devtools let you inspect registered table instances, switch between multiple tables, and inspect features, state, options, rows, and columns in real time.

> [!NOTE]
> By default, the framework adapters only include the live devtools in development mode. In production builds they export no-op implementations unless you opt into the `/production` entrypoints.

## Installation

Install the TanStack Devtools host package and the Table adapter for your framework:

### React

```sh
npm install @tanstack/react-devtools @tanstack/react-table-devtools
```

### Preact

```sh
npm install @tanstack/preact-devtools @tanstack/preact-table-devtools
```

### Solid

```sh
npm install @tanstack/solid-devtools @tanstack/solid-table-devtools
```

### Vue

```sh
npm install @tanstack/vue-devtools @tanstack/vue-table-devtools
```

Angular, Lit, Svelte, and vanilla do not currently ship dedicated table devtools adapters.

## Setup Pattern

The recommended setup has two parts:

1. Mount `TanStackDevtools` at the app root with `tableDevtoolsPlugin()`
2. Call `useTanStackTableDevtools(table, name?)` immediately after creating each table

If you register multiple tables, the Table panel shows a selector so you can switch between them.

## React Setup

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { useTable } from '@tanstack/react-table'
import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/react-table-devtools'

function App() {
  const table = useTable({
    // ...
  })

  useTanStackTableDevtools(table, 'Users Table')

  return <AppContent table={table} />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
  </React.StrictMode>,
)
```

See the [React row-selection example](./framework/react/examples/row-selection).

## Preact Setup

```tsx
import { render } from 'preact'
import { useTable } from '@tanstack/preact-table'
import { TanStackDevtools } from '@tanstack/preact-devtools'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/preact-table-devtools'

function App() {
  const table = useTable({
    // ...
  })

  useTanStackTableDevtools(table, 'Users Table')

  return <AppContent table={table} />
}

render(
  <>
    <App />
    <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
  </>,
  document.getElementById('root')!,
)
```

See the [Preact sorting example](./framework/preact/examples/sorting).

## Solid Setup

```tsx
import { render } from 'solid-js/web'
import { createTable } from '@tanstack/solid-table'
import { TanStackDevtools } from '@tanstack/solid-devtools'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/solid-table-devtools'

function App() {
  const table = createTable({
    // ...
  })

  useTanStackTableDevtools(table, 'Users Table')

  return <AppContent table={table} />
}

render(
  () => (
    <>
      <App />
      <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
    </>
  ),
  document.getElementById('root')!,
)
```

See the [Solid row-selection example](./framework/solid/examples/row-selection).

## Vue Setup

```ts
// main.ts
import { createApp, defineComponent, h } from 'vue'
import { TanStackDevtools } from '@tanstack/vue-devtools'
import { tableDevtoolsPlugin } from '@tanstack/vue-table-devtools'
import App from './App.vue'

const Root = defineComponent({
  setup() {
    return () => [
      h(App),
      h(TanStackDevtools, {
        plugins: [tableDevtoolsPlugin()],
      }),
    ]
  },
})

createApp(Root).mount('#app')
```

```vue
<script setup lang="ts">
import { useTable } from '@tanstack/vue-table'
import { useTanStackTableDevtools } from '@tanstack/vue-table-devtools'

const table = useTable({
  // ...
})

useTanStackTableDevtools(table, 'Users Table')
</script>
```

See the [Vue row-selection example](./framework/vue/examples/row-selection).

## Naming Tables

The optional second argument lets you label a table in the devtools selector:

```ts
useTanStackTableDevtools(table, 'Orders Table')
```

If you omit the name, the devtools assign fallback names such as `Table 1` and `Table 2`.

## Production Builds

If you need the live devtools in production, import from the `/production` entrypoint for your framework package:

```tsx
import { tableDevtoolsPlugin } from '@tanstack/react-table-devtools/production'
import { useTanStackTableDevtools } from '@tanstack/react-table-devtools/production'
```

Equivalent `/production` entrypoints are available for the Preact, Solid, and Vue adapters as well.
