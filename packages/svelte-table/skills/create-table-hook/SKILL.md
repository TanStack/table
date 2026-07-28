---
name: create-table-hook
description: >
  Define a Svelte createAppTable/createAppColumnHelper using the adapter's rune-capable createTableHook implementation, shared features/defaults, reactive per-table getters, optional App component registries, and typed table/cell/header context hooks.
metadata:
  type: framework
  library: '@tanstack/svelte-table'
  framework: svelte
  library_version: '9.0.0-beta.58'
requires:
  - '@tanstack/table-core#core'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:docs/framework/svelte/guide/composable-tables.md'
  - 'TanStack/table:examples/svelte/composable-tables'
  - 'TanStack/table:packages/svelte-table/src/createTableHook.svelte.ts'
---

This skill builds on `@tanstack/table-core#core`, `getting-started`, and `table-state`. Use it when multiple tables share conventions; keep one-off tables on `createTable`.

## Setup

Use the shipped `createTableHook`; its implementation is rune-capable. The app hook module itself may be a normal `.ts` module, as in the maintained example.

```ts
import {
  createTableHook,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/svelte-table'

export const {
  createAppTable,
  createAppColumnHelper,
  useTableContext,
  useCellContext,
  useHeaderContext,
} = createTableHook({
  features: tableFeatures({ rowSortingFeature }),
})
```

```svelte
<script lang="ts">
  import { createAppColumnHelper, createAppTable } from './app-table.svelte'
  type Person = { name: string }
  const helper = createAppColumnHelper<Person>()
  const columns = helper.columns([helper.accessor('name', { header: 'Name' })])
  let data = $state<Person[]>([{ name: 'Ada' }])
  const table = createAppTable({
    columns,
    get data() {
      return data
    },
  })
</script>
```

## Core Patterns

### Register reusable components once

Pass stable `tableComponents`, `cellComponents`, and `headerComponents` to `createTableHook`. Render them through the returned `AppTable`, `AppCell`, and `AppHeader` wrappers so their typed context hooks have a provider.

### Prefer context inside registered components

```ts
import { useCellContext } from './app-table.svelte'

const cell = useCellContext<string>()
const value = cell.getValue()
```

This avoids prop drilling and keeps feature/component types bound to the app hook.

## Common Mistakes

### CRITICAL Reimplementing the rune-aware hook

Wrong:

```ts
// app-table.ts
export function createAppTable(options) {
  return constructTable(options)
}
```

Correct:

```ts
// app-table.ts
export const { createAppTable } = createTableHook({ features })
```

The shipped implementation supplies Svelte rune reactivity, option synchronization, wrappers, and context plumbing that a plain core wrapper omits.

Source: `packages/svelte-table/src/createTableHook.svelte.ts`

### HIGH Freezing per-table rune inputs

Wrong:

```ts
const table = createAppTable({ columns, data })
```

Correct:

```ts
const table = createAppTable({
  columns,
  get data() {
    return data
  },
})
```

Shared defaults are static, but each table must still expose current reactive values.

Source: `docs/framework/svelte/guide/composable-tables.md`

### HIGH Reading context outside its wrapper

Wrong:

```ts
const cell = useCellContext()
```

Correct:

```svelte
<table.AppCell {cell}><cell.TextCell /></table.AppCell>
```

Context helpers require the matching App wrapper in the rendered ancestor tree.

Source: `packages/svelte-table/src/createTableHook.svelte.ts`

### MEDIUM Abstracting a single table too early

Wrong:

```ts
const hook = createTableHook({ features: tableFeatures({}) })
```

Correct:

```ts
const table = createTable({
  features: tableFeatures({}),
  columns,
  get data() {
    return data
  },
})
```

Use the hook for recurring app conventions, not merely to rename standalone construction.

Source: `docs/framework/svelte/guide/composable-tables.md`

## API Discovery

Inspect `node_modules/@tanstack/svelte-table/dist/createTableHook.svelte.d.ts` and the `App*.svelte` wrappers for exact returned helpers and component contracts.
