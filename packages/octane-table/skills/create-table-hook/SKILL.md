---
name: create-table-hook
description: >
  Create reusable Octane table infrastructure with createTableHook, useAppTable, createAppColumnHelper, registered components, stable App wrappers, and typed context hooks. Load for recurring conventions, scoped contexts, or prop drilling.
metadata:
  {
    type: framework,
    library: '@tanstack/octane-table',
    library_version: '9.0.0-beta.80',
    framework: octane,
  }
requires: ['@tanstack/table-core#core', getting-started, table-state]
sources:
  - 'TanStack/table:docs/framework/octane/guide/composable-tables.md'
  - 'TanStack/table:docs/framework/octane/guide/table-context.md'
  - 'TanStack/table:examples/octane/composable-tables'
  - 'TanStack/table:packages/octane-table/src/createTableHook.tsrx'
  - 'TanStack/table:packages/octane-table/src/createTableHookContexts.ts'
---

This skill builds on `@tanstack/table-core#core`, `getting-started`, and `table-state`. Use the app hook for repeated conventions; keep a one-off table on `useTable`.

## Setup

```tsrx
import {
  createTableHook,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/octane-table'

export const { createAppColumnHelper, useAppTable, useTableContext } =
  createTableHook({
    features: tableFeatures({ rowSelectionFeature }),
    getRowId: (row: { id: string }) => row.id,
  })
```

Create the factory at module scope. Its wrappers have stable identities and read the latest table facade without remounting their child subtrees.

## Core Patterns

### Use the factory-bound helper

```tsrx
type Person = { id: string; name: string }
const helper = createAppColumnHelper<Person>()
const columns = helper.columns([helper.accessor('name', { header: 'Name' })])
```

### Consume typed context under its wrapper

```tsrx
function RowCount() @{
  const table = useTableContext()
  <output>{String(table.getRowModel().rows.length)}</output>
}

function Grid() @{
  const table = useAppTable({ data, columns })
  <table.AppTable><RowCount /></table.AppTable>
}
```

`AppTable` takes static children without a selector. Use function children when a selector supplies their value:

```tsrx
<table.AppTable selector={(state) => state.rowSelection}>
  {(rowSelection) => <output>{String(Object.keys(rowSelection).length)}</output>}
</table.AppTable>
```

Render `AppTable`, `AppCell`, `AppHeader`, `AppFooter`, and registered components with JSX. The wrappers establish context and independent Octane scopes.

### Isolate genuinely nested table setups

Default contexts are module-scoped and HMR-stable. Sibling tables are isolated by their providers, but nested factories can resolve a consumer to the inner provider. Create fresh contexts for distinct nested setups:

```tsrx
import {
  createTableHook,
  createTableHookContexts,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/octane-table'

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

Prefer hooks returned by `createTableHook` because their types include registered component maps.

## Common Mistakes

### MEDIUM Abstracting a single table

Wrong:

```tsrx
const app = createTableHook({ features: tableFeatures({}) })
```

Correct:

```tsrx
const table = useTable({ features, columns, data })
```

The factory is valuable when it centralizes repeated policy, registered renderers, or typed context—not merely as another constructor name.

Source: `docs/framework/octane/guide/composable-tables.md`

### HIGH Reading outside the matching provider

Wrong:

```tsrx
function Grid() @{
  <RowCount />
}
```

Correct:

```tsrx
function Grid() @{
  const table = useAppTable({ data, columns })
  <table.AppTable><RowCount /></table.AppTable>
}
```

Factory context hooks throw actionable errors when the matching `AppTable`, `AppCell`, or `AppHeader` provider is missing.

Source: `packages/octane-table/src/createTableHook.tsrx`

### HIGH Recreating the factory during render

Wrong:

```tsrx
function Grid() @{
  const app = createTableHook({ features })
  const table = app.useAppTable({ data, columns })
  <table.AppTable />
}
```

Correct:

```tsrx
const app = createTableHook({ features })

function Grid() @{
  const table = app.useAppTable({ data, columns })
  <table.AppTable />
}
```

A factory created during render makes hook configuration, wrappers, contexts, and registered component identities unstable.

Source: `packages/octane-table/src/createTableHook.tsrx`

## API Discovery

Inspect `node_modules/@tanstack/octane-table/dist/createTableHook.d.ts`, `createTableHookContexts.d.ts`, and `types.d.ts` for exact return names, wrapper props, registries, and scoped context types.
