---
name: create-table-hook
description: >
  Share Alpine tableFeatures, defaults, createAppTable, and createAppColumnHelper with createTableHook. Load when multiple Alpine tables repeat infrastructure; unlike JSX adapters, Alpine has no registered table/cell/header component or context registry.
metadata:
  type: framework
  library: '@tanstack/alpine-table'
  framework: alpine
  library_version: '9.0.0-beta.65'
requires:
  - '@tanstack/table-core#core'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:docs/framework/alpine/guide/composable-tables.md'
  - 'TanStack/table:examples/alpine/basic-app-table'
  - 'TanStack/table:packages/alpine-table/src/createTableHook.ts'
---

This skill builds on @tanstack/table-core#core plus this package's getting-started and table-state skills.

## Setup

```ts
import Alpine from 'alpinejs'
import { createTableHook, tableFeatures } from '@tanstack/alpine-table'

type Person = { id: string; name: string }
const { createAppTable, createAppColumnHelper } = createTableHook({
  features: tableFeatures({}),
  getRowId: (row: Person) => row.id,
})
const helper = createAppColumnHelper<Person>()
const columns = helper.columns([helper.accessor('name', { header: 'Name' })])

Alpine.data('peopleTable', () => {
  const local = Alpine.reactive({
    data: [{ id: '1', name: 'Ada' }] as Array<Person>,
  })
  const table = createAppTable({
    columns,
    get data() {
      return local.data
    },
  })
  return { table }
})
```

## Core Patterns

### Share infrastructure, keep data local

Bind features, row models, row IDs, and defaults in the factory. Each Alpine component passes its own columns, reactive data getter, and controlled state.

### Reuse markup with Alpine primitives

Use real templates and `Alpine.bind` bundles for interactive reuse. `createTableHook` intentionally returns no component registry or context hooks.

### Use the helper to retain feature inference

Columns from `createAppColumnHelper<TData>()` know the factory's registered features without userland feature generics.

## Common Mistakes

### HIGH Assuming a JSX component registry

Wrong: pass `cellComponents` or `tableComponents` to Alpine `createTableHook`.

Correct: share features/defaults with the hook and build reusable interactive markup with Alpine templates or bind bundles.

The Alpine hook returns only app features, a column helper, and createAppTable.

Source: TanStack/table:packages/alpine-table/src/createTableHook.ts

### MEDIUM Abstracting a one-off table

Wrong: introduce an app factory for one table with no shared conventions.

Correct: use standalone `createTable` until infrastructure repeats.

The hook is an application reuse boundary, not required setup.

Source: TanStack/table:docs/framework/alpine/guide/composable-tables.md

### HIGH Reactive data captured as a snapshot

Wrong: `createAppTable({ columns, data: local.data })` when the array will be replaced.

Correct: provide a `get data()` option.

The app factory delegates to Alpine createTable, whose option effect tracks getters.

Source: TanStack/table:packages/alpine-table/src/createTable.ts

## API Discovery

Inspect `node_modules/@tanstack/alpine-table/dist/createTableHook.d.ts`; do not infer component/context APIs from React, Vue, Solid, Svelte, Angular, or Lit adapters.
