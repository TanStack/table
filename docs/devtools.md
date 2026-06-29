---
title: Devtools
id: devtools
---

TanStack Table provides framework-specific devtools adapters that plug into the [TanStack Devtools](https://tanstack.com/devtools) multi-panel UI.

The table devtools let you inspect registered table instances, switch between multiple tables, and inspect features, state, options, rows, and columns in real time.

> [!NOTE]
> By default, the framework adapters only include the live devtools in development mode. In production builds they export no-op implementations unless you opt into the `/production` entrypoints.

## Installation

Install the TanStack Devtools host package and the Table adapter for your framework.

> [!IMPORTANT]
> While TanStack Table v9 is in beta, the table devtools adapters must be installed with the `@beta` tag. Installing without the tag resolves to the old v8 devtools, which have a completely different API.

<!-- ::start:framework -->

# React

```sh
npm install @tanstack/react-devtools @tanstack/react-table-devtools@beta
```

# Preact

```sh
npm install @tanstack/preact-devtools @tanstack/preact-table-devtools@beta
```

# Vue

```sh
npm install @tanstack/vue-devtools @tanstack/vue-table-devtools@beta
```

# Solid

```sh
npm install @tanstack/solid-devtools @tanstack/solid-table-devtools@beta
```

# Angular

```sh
npm install @tanstack/angular-devtools @tanstack/angular-table-devtools@beta
```

<!-- ::end:framework -->

Lit, Svelte, and vanilla do not currently ship dedicated table devtools adapters.

## The Required `key` Table Option

The devtools identify each table by the `key` table option. Registration requires it: if you register a table without a `key`, the devtools log an error (`Missing table key. Add a 'key' option to your table to use devtools.`) and skip the table entirely.

```ts
const table = useTable({
  key: 'users-table', // needed for devtools, omit if you don't want to use the devtools
  features,
  columns,
  data,
})
```

The `key` is also the label shown in the devtools panel selector, so give each table a unique, descriptive key.

## Setup Pattern

The recommended setup has three parts:

1. Give each table a unique `key` option
2. Mount `TanStackDevtools` at the app root with `tableDevtoolsPlugin()`
3. Register each table with `useTanStackTableDevtools(table)` (or `injectTanStackTableDevtools` in Angular) immediately after creating it

If you register multiple tables, the Table panel shows a selector so you can switch between them.

## Setup

<!-- ::start:framework -->

# React

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
    key: 'users-table', // needed for devtools
    // ...
  })

  useTanStackTableDevtools(table)

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

# Preact

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
    key: 'users-table', // needed for devtools
    // ...
  })

  useTanStackTableDevtools(table)

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

See the [Preact row-selection example](./framework/preact/examples/row-selection).

# Vue

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
        plugins: [tableDevtoolsPlugin({})],
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
  key: 'users-table', // needed for devtools
  // ...
})

useTanStackTableDevtools(table)
</script>
```

See the [Vue row-selection example](./framework/vue/examples/row-selection).

# Solid

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
    key: 'users-table', // needed for devtools
    // ...
  })

  useTanStackTableDevtools(table)

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

# Angular

Provide the devtools host once in your application config, rendering the table panel from `@tanstack/angular-table-devtools`:

```ts
// app.config.ts
import { isDevMode } from '@angular/core'
import { provideTanStackDevtools } from '@tanstack/angular-devtools/provider'
import type { ApplicationConfig } from '@angular/core'

export const appConfig: ApplicationConfig = {
  providers: [
    isDevMode()
      ? provideTanStackDevtools(() => ({
          plugins: [
            {
              name: 'TanStack Table',
              render: () =>
                import('@tanstack/angular-table-devtools').then((m) =>
                  m.TableDevtoolsPanel(),
                ),
            },
          ],
        }))
      : [],
  ],
}
```

Then register each table with `injectTanStackTableDevtools` in an injection context (such as a component constructor):

```ts
import { Component } from '@angular/core'
import { injectTable } from '@tanstack/angular-table'
import { injectTanStackTableDevtools } from '@tanstack/angular-table-devtools'

@Component({
  // ...
})
export class App {
  constructor() {
    injectTanStackTableDevtools(() => ({
      table: this.table,
    }))
  }

  readonly table = injectTable(() => ({
    key: 'users-table', // needed for devtools
    // ...
  }))
}
```

See the [Angular basic example](./framework/angular/examples/basic-inject-table) or the [Angular row-selection example](./framework/angular/examples/row-selection).

<!-- ::end:framework -->

## Disabling Registration

Each registration function accepts an `enabled` option if you want to conditionally register a table:

<!-- ::start:framework -->

# React

```ts
useTanStackTableDevtools(table, { enabled: false })
```

# Preact

```ts
useTanStackTableDevtools(table, { enabled: false })
```

# Vue

```ts
useTanStackTableDevtools(table, { enabled: false })
```

# Solid

```ts
useTanStackTableDevtools(table, { enabled: false })
```

# Angular

```ts
injectTanStackTableDevtools(() => ({
  table: this.table,
  enabled: () => false,
}))
```

<!-- ::end:framework -->

## Production Builds

If you need the live devtools in production, import from the `/production` entrypoint for your framework package:

<!-- ::start:framework -->

# React

```tsx
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/react-table-devtools/production'
```

# Preact

```tsx
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/preact-table-devtools/production'
```

# Vue

```tsx
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/vue-table-devtools/production'
```

# Solid

```tsx
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/solid-table-devtools/production'
```

# Angular

```ts
import { injectTanStackTableDevtools } from '@tanstack/angular-table-devtools/production'
```

<!-- ::end:framework -->
