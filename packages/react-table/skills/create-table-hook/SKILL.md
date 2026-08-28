---
name: create-table-hook
description: >
  Build reusable React table infrastructure with createTableHook, useAppTable, createAppColumnHelper, shared features/defaults, component registries, AppTable/AppCell/AppHeader wrappers, and typed context hooks. Load for recurring application table conventions, scoped contexts, HMR cycles, or table prop drilling.
metadata:
  type: framework
  library: '@tanstack/react-table'
  library_version: '9.2.4'
  framework: react
requires:
  - '@tanstack/table-core#core'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:docs/framework/react/guide/composable-tables.md'
  - 'TanStack/table:docs/framework/react/guide/table-context.md'
  - 'TanStack/table:examples/react/composable-tables'
  - 'TanStack/table:packages/react-table/src/createTableHook.tsx'
  - 'TanStack/table:packages/react-table/src/createTableHookContexts.tsx'
---

This skill builds on `@tanstack/table-core#core`, `getting-started`, and `table-state`. Use a factory when multiple tables share real conventions; use standalone `useTable` for a one-off.

## Setup

```tsx
import {
  createTableHook,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/react-table'

export const { createAppColumnHelper, useAppTable, useTableContext } =
  createTableHook({
    features: tableFeatures({ rowSelectionFeature }),
    getRowId: (row: { id: string }) => row.id,
  })
```

Keep this factory in an infrastructure module. It binds feature types and defaults once while each `useAppTable` call still supplies its own data, columns, state, and initial state.

## Core Patterns

### Infer columns through the bound helper

```tsx
type Person = { id: string; name: string }
const helper = createAppColumnHelper<Person>()
const columns = helper.columns([helper.accessor('name', { header: 'Name' })])

function People({ data }: { data: Person[] }) {
  const table = useAppTable({ data, columns })
  return (
    <table.AppTable>
      <div>{table.getRowModel().rows.length}</div>
    </table.AppTable>
  )
}
```

`AppTable` takes ordinary JSX children when it has no selector. Function children are only valid with a selector:

```tsx
<table.AppTable selector={(state) => state.rowSelection}>
  {(rowSelection) => <output>{Object.keys(rowSelection).length}</output>}
</table.AppTable>
```

### Read registered context instead of drilling props

```tsx
function RowCount() {
  const table = useTableContext()
  return <output>{table.getRowModel().rows.length}</output>
}
```

Register reusable table/cell/header components in the factory and consume them under their matching `App*` provider.

### Isolate genuinely nested table setups

The default module-scoped contexts are HMR-stable, and normal provider scoping already isolates sibling tables. Separate `createTableHook` calls still use those shared default contexts, so nested providers can silently resolve a consumer to the inner table. Create scoped contexts only when different table setups are nested:

```tsx
import {
  createTableHook,
  createTableHookContexts,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/react-table'

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

Prefer context hooks returned by `createTableHook`; they include the registered component maps in their types. Hooks returned directly by `createTableHookContexts` know only `TFeatures` and are useful from modules that cannot import the completed factory.

## Common Mistakes

### MEDIUM Factory for a one-off table

Wrong:

```tsx
const { useAppTable } = createTableHook({ features: tableFeatures({}) })
```

Correct:

```tsx
const table = useTable({ features: tableFeatures({}), columns, data })
```

A factory adds an app-wide abstraction; standalone construction is clearer without shared conventions.

Source: `docs/framework/react/guide/composable-tables.md`

### HIGH Creating the factory during render

Wrong:

```tsx
function People() {
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
function People() {
  const table = app.useAppTable({ data, columns })
  return (
    <table.AppTable>
      <div />
    </table.AppTable>
  )
}
```

Creating a new factory closure during render makes hook configuration and component registries unstable. Keep the factory and its bound hook identity at module scope.

Source: `packages/react-table/src/createTableHook.tsx`

### HIGH Closing a circular HMR import

Wrong:

```tsx
// table.ts imports RowCount; RowCount.tsx imports useTableContext from table.ts
export const app = createTableHook({ features, tableComponents: { RowCount } })
```

Correct:

```tsx
// components.tsx receives the exported hook through a cycle-free module boundary
export const app = createTableHook({ features })
```

Keep the factory dependency graph acyclic or inject components from a separate composition root; circular registries can break Vite HMR.

Source: `https://github.com/TanStack/table/issues/6348`

## API Discovery

Inspect `node_modules/@tanstack/react-table/dist/createTableHook.d.ts` and `createTableHookContexts.d.ts` for the exact returned helpers, component registries, wrapper props, and scoped context types.
