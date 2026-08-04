---
name: create-table-hook
description: >
  Create reusable Preact table infrastructure with createTableHook, useAppTable, createAppColumnHelper, shared options/features, optional component registries, App wrappers, and typed context hooks. Load for recurring conventions, scoped contexts, or prop drilling.
metadata:
  {
    type: framework,
    library: '@tanstack/preact-table',
    library_version: '9.0.0',
    framework: preact,
  }
requires: ['@tanstack/table-core#core', getting-started, table-state]
sources:
  - 'TanStack/table:docs/framework/preact/guide/composable-tables.md'
  - 'TanStack/table:docs/framework/preact/guide/table-context.md'
  - 'TanStack/table:examples/preact/composable-tables'
  - 'TanStack/table:packages/preact-table/src/createTableHook.tsx'
  - 'TanStack/table:packages/preact-table/src/createTableHookContexts.tsx'
---

This skill builds on `@tanstack/table-core#core`, `getting-started`, and `table-state`. Use the app hook for repeated conventions; one-off tables should stay with `useTable`.

## Setup

```tsx
import {
  createTableHook,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/preact-table'

export const { createAppColumnHelper, useAppTable, useTableContext } =
  createTableHook({
    features: tableFeatures({ rowSelectionFeature }),
    getRowId: (row: { id: string }) => row.id,
  })
```

## Core Patterns

### Use the factory-bound helper

```tsx
type Person = { id: string; name: string }
const helper = createAppColumnHelper<Person>()
const columns = helper.columns([helper.accessor('name', { header: 'Name' })])
```

### Consume typed context under its wrapper

```tsx
function RowCount() {
  const table = useTableContext()
  return <output>{table.getRowModel().rows.length}</output>
}
const table = useAppTable({ data, columns })
return (
  <table.AppTable>
    <RowCount />
  </table.AppTable>
)
```

`AppTable` takes ordinary JSX children without a selector. Use function children only when a selector supplies their value:

```tsx
<table.AppTable selector={(state) => state.rowSelection}>
  {(rowSelection) => <output>{Object.keys(rowSelection).length}</output>}
</table.AppTable>
```

### Isolate genuinely nested table setups

Default contexts are module-scoped and HMR-stable; sibling tables are already isolated by their providers. Separate `createTableHook` calls still share those defaults, so nested providers can silently resolve a consumer to the inner table. Use fresh contexts only when different table setups are nested:

```tsx
import {
  createTableHook,
  createTableHookContexts,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/preact-table'

const features = tableFeatures({ rowSelectionFeature })
const { tableContext, cellContext, headerContext } =
  createTableHookContexts<typeof features>()

export const app = createTableHook({
  features,
  tableContext,
  cellContext,
  headerContext,
})
```

Prefer hooks returned by `createTableHook` because their types include registered component maps. Hooks returned directly by `createTableHookContexts` know only `TFeatures` and support modules that cannot import the completed factory.

## Common Mistakes

### MEDIUM Abstracting a single table

Wrong:

```tsx
const app = createTableHook({ features: tableFeatures({}) })
```

Correct:

```tsx
const table = useTable({ features, columns, data })
```

The factory is valuable when it centralizes repeated policy, not merely another constructor name.

Source: `docs/framework/preact/guide/composable-tables.md`

### HIGH Reading outside the matching provider

Wrong:

```tsx
return <RowCount />
```

Correct:

```tsx
return (
  <table.AppTable>
    <RowCount />
  </table.AppTable>
)
```

Factory context hooks require the corresponding `AppTable`, `AppCell`, or `AppHeader` wrapper.

Source: `packages/preact-table/src/createTableHook.tsx`

### HIGH Recreating contexts per render

Wrong:

```tsx
function Grid() {
  const app = createTableHook({ features })
  const table = app.useAppTable({ data, columns })
  return (
    <table.AppTable>
      <div />
    </table.AppTable>
  )
}
```

Correct:

```tsx
const app = createTableHook({ features })
function Grid() {
  const table = app.useAppTable({ data, columns })
  return (
    <table.AppTable>
      <div />
    </table.AppTable>
  )
}
```

Creating a new factory closure during render makes hook configuration and component registries unstable. Keep the factory and its bound hook identity at module scope.

Source: `packages/preact-table/src/createTableHook.tsx`

## API Discovery

Inspect `node_modules/@tanstack/preact-table/dist/createTableHook.d.ts` and `createTableHookContexts.d.ts` for exact return names, provider props, registries, and scoped context types.
