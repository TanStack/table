---
name: vue/compose-with-tanstack-devtools
description: >
  Wire up TanStack Devtools for TanStack Table in Vue. Mount `TanStackDevtools`
  with `tableDevtoolsPlugin({})` from the app root and call
  `useTanStackTableDevtools(table)` inside `<script setup>` after each
  `useTable()`. Live devtools are tree-shaken to no-ops in production unless you
  import from `@tanstack/vue-table-devtools/production`.
type: composition
library: tanstack-table
framework: vue
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - vue/table-state
sources:
  - TanStack/table:docs/devtools.md
  - TanStack/table:packages/vue-table-devtools/src/index.ts
  - TanStack/table:packages/vue-table-devtools/src/plugin.ts
  - TanStack/table:packages/vue-table-devtools/src/useTanStackTableDevtools.ts
  - TanStack/table:packages/vue-table-devtools/src/production.ts
---

This skill builds on `tanstack-table/vue/table-state`. Read that first — the devtools panel inspects whatever table instance you register, so you need a working `useTable` before this skill is useful.

## Setup

Install the TanStack Devtools host and the Vue Table adapter:

```sh
pnpm add @tanstack/vue-devtools @tanstack/vue-table-devtools
```

The recommended pattern has two parts:

1. Mount `TanStackDevtools` once at the app root with `tableDevtoolsPlugin({})`.
2. Call `useTanStackTableDevtools(table)` inside `<script setup>` after each `useTable()`.

### App Root (`main.ts`)

```ts
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

### Component (`UsersScreen.vue`)

```vue
<script setup lang="ts">
import { useTable } from '@tanstack/vue-table'
import { useTanStackTableDevtools } from '@tanstack/vue-table-devtools'

const table = useTable({
  features,
  key: 'users-table',
  columns,
  data,
})

useTanStackTableDevtools(table)
</script>

<template>
  <UsersGrid :table="table" />
</template>
```

`tableDevtoolsPlugin({})` returns a plugin descriptor for the multi-panel TanStack Devtools UI. `useTanStackTableDevtools` is a Vue composable that registers/unregisters the table via a `watchEffect`, so it reacts to `MaybeRef` inputs for the table, name, and `enabled` option.

## Patterns

### Keying Tables

Add a stable `key` option to the table options. Devtools use this key as both the registration id and the panel selector label.

```ts
useTanStackTableDevtools(table)
```

The name may be reactive — pass a `Ref<string>` to update the label live.

### Multiple Tables

Register multiple tables and the Table panel renders a selector. Name each one.

```vue
<script setup lang="ts">
const ordersTable = useTable(ordersOptions)
const usersTable = useTable(usersOptions)

useTanStackTableDevtools(ordersTable)
useTanStackTableDevtools(usersTable)
</script>
```

### Disabling Per Table

`useTanStackTableDevtools` accepts an `enabled` option (reactive). When `false`, the registration is removed but the composable runs cleanly.

```ts
import { ref } from 'vue'
const showTableDevtools = ref(false)

useTanStackTableDevtools(table, {
  enabled: showTableDevtools.value,
})
```

### Production Builds

The default `@tanstack/vue-table-devtools` entrypoint swaps to no-op implementations when `process.env.NODE_ENV !== 'development'`. To ship the real devtools to production, switch BOTH imports to the `/production` entrypoint:

```ts
// main.ts
import { tableDevtoolsPlugin } from '@tanstack/vue-table-devtools/production'
```

```vue
<script setup lang="ts">
import { useTanStackTableDevtools } from '@tanstack/vue-table-devtools/production'
</script>
```

If you mix entrypoints (one from `/production`, one from the default), one side is a no-op in production and the panel will appear empty.

### Conditional Devtools by Env

A common pattern is to dynamically import the production entrypoint behind a feature flag:

```ts
import { defineAsyncComponent } from 'vue'

const TableDevtoolsRoot = defineAsyncComponent(async () => {
  const { tableDevtoolsPlugin } =
    await import('@tanstack/vue-table-devtools/production')
  const { TanStackDevtools } = await import('@tanstack/vue-devtools')
  return {
    setup() {
      return () => h(TanStackDevtools, { plugins: [tableDevtoolsPlugin({})] })
    },
  }
})
```

## Common Mistakes

### Forgetting to mount `TanStackDevtools` at the app root

Calling `useTanStackTableDevtools(table)` alone does nothing visible — it only registers the table with the devtools target store. Without a `<TanStackDevtools :plugins="[tableDevtoolsPlugin({})]" />` (or `h(TanStackDevtools, ...)`) somewhere in the tree, there is no panel to render the registration. Symptom: composable runs without errors, no devtools button appears.

### Importing devtools from the default path in a prod-only bundle

If you only deploy production builds, `@tanstack/vue-table-devtools` resolves to no-op implementations. The plugin will mount, but the panel will be empty. Use `@tanstack/vue-table-devtools/production` if you want the real devtools available there.

### Accidentally shipping devtools to end users via `/production`

The flip side: importing from `/production` in your default app bundle means every visitor downloads and runs the devtools UI. That is usually not what you want. Restrict `/production` imports to dev/preview entrypoints or code-split them behind a flag.

### Calling `useTanStackTableDevtools` outside `setup`

The composable uses `watchEffect`, so it should run inside a component's `setup` / `<script setup>` block where Vue can own the effect cleanup.

### Multiple tables without keys

A table registered without `options.key` is skipped and devtools log an error. Add a unique `key` option to every table that should appear in devtools.
