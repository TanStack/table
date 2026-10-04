# Alpine reusable table hooks

Read when multiple Alpine tables share features, defaults, or rendering conventions. Keep standalone construction for tables without shared conventions. For controlled state or reactive reads, read [table-state](../../table-state/SKILL.md).

This reference inherits the version of its owning skill.

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

## Core patterns

### Share infrastructure, keep data local

Bind features, row models, row IDs, and defaults in the factory. Each Alpine component passes its own columns, reactive data getter, and controlled state.

### Reuse markup with Alpine primitives

Use real templates and `Alpine.bind` bundles for interactive reuse. `createTableHook` intentionally returns no component registry or context hooks.

### Use the helper to retain feature inference

Columns from `createAppColumnHelper<TData>()` know the factory's registered features without userland feature generics.

## Common mistakes

### HIGH Assuming a JSX component registry

Wrong: pass `cellComponents` or `tableComponents` to Alpine `createTableHook`.

Correct: share features/defaults with the hook and build reusable interactive markup with Alpine templates or bind bundles.

The Alpine hook returns only app features, a column helper, and createAppTable.

Source: TanStack/table:packages/alpine-table/src/createTableHook.ts

### HIGH Reactive data captured as a snapshot

Wrong: `createAppTable({ columns, data: local.data })` when the array will be replaced.

Correct: provide a `get data()` option.

The app factory delegates to Alpine createTable, whose option effect tracks getters.

Source: TanStack/table:packages/alpine-table/src/createTable.ts

## API discovery

Inspect `node_modules/@tanstack/alpine-table/dist/createTableHook.d.ts`; do not infer component/context APIs from React, Vue, Solid, Svelte, Angular, or Lit adapters.

## Sources

- `TanStack/table:docs/framework/alpine/guide/composable-tables.md`
- `TanStack/table:examples/alpine/basic-app-table`
- `TanStack/table:packages/alpine-table/src/createTableHook.ts`
