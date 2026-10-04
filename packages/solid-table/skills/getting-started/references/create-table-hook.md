# Reusable Solid table hooks

Use this reference when multiple Solid tables share features, defaults, or registered components. Keep one-off tables on `createTable`. For controlled state or subscription changes, read [table state](../../table-state/SKILL.md).

## Setup

```tsx
import {
  createTableHook,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/solid-table'

export const { createAppColumnHelper, createAppTable, useTableContext } =
  createTableHook({
    features: tableFeatures({ rowSelectionFeature }),
    getRowId: (row: { id: string }) => row.id,
  })
```

## Core patterns

### Infer columns with the bound helper

```tsx
type Person = { id: string; name: string }
const helper = createAppColumnHelper<Person>()
const columns = helper.columns([helper.accessor('name', { header: 'Name' })])
```

### Preserve per-table reactivity

```tsx
const table = createAppTable({
  columns,
  get data() {
    return data()
  },
})
return <table.AppTable>{() => <RowCount />}</table.AppTable>
```

## Common mistakes

### Choose a factory for repeated conventions

A factory for shared conventions:

```tsx
const app = createTableHook({ features: tableFeatures({}) })
```

Standalone construction for a one-off table:

```tsx
const table = createTable({ features, columns, data })
```

The factory should encode repeated app conventions rather than add ceremony.

Source: `docs/framework/solid/guide/composable-tables.md`

### HIGH Passing per-table snapshots

Wrong:

```tsx
createAppTable({ columns, data: data() })
```

Correct:

```tsx
createAppTable({
  columns,
  get data() {
    return data()
  },
})
```

The getter preserves Solid tracking when the signal changes.

Source: `examples/solid/composable-tables`

### HIGH Reading context outside wrappers

Wrong:

```tsx
return <RowCount />
```

Correct:

```tsx
return <table.AppTable>{() => <RowCount />}</table.AppTable>
```

Returned context hooks must run under the matching factory wrapper; use them instead of prop drilling registered components.

Source: `packages/solid-table/src/createTableHook.tsx`

## API discovery

Inspect `node_modules/@tanstack/solid-table/dist/createTableHook.d.ts` for exact returned names, component binding, context providers, and reactive option merging.

## Sources

- `TanStack/table:docs/framework/solid/guide/composable-tables.md`
- `TanStack/table:examples/solid/composable-tables`
- `TanStack/table:packages/solid-table/src/createTableHook.tsx`
