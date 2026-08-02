---
name: table-state
description: >
  Read, select, subscribe to, and control React Table v9 state with useTable selectors, table.state, table.Subscribe, table.atoms, table.store, and external TanStack Store atoms. Load for controlled state, render performance, or React Compiler builder-method subscription problems.
metadata:
  type: framework
  library: '@tanstack/react-table'
  library_version: '9.0.0-beta.75'
  framework: react
requires:
  - '@tanstack/table-core#core'
  - getting-started
sources:
  - 'TanStack/table:docs/framework/react/guide/table-state.md'
  - 'TanStack/table:examples/react/basic-subscribe'
  - 'TanStack/table:packages/react-table/src/Subscribe.ts'
  - 'TanStack/table:packages/react-table/src/useTable.ts'
---

This skill builds on `@tanstack/table-core#core` and `getting-started`. Read them first for table construction and feature-owned state.

## State Mental Model

TanStack Table is primarily a state coordinator. Keep state internal unless another subsystem needs to read, persist, validate, or drive it. With no `initialState`, `atoms`, `state`, or `on[State]Change` options, the table owns all registered slices.

- `table.baseAtoms` are the internal writable atoms initialized from resolved initial state.
- `table.atoms` are readonly derived atoms for the active owner of each registered slice.
- `table.store` combines those atoms into one readonly flat store.
- `table.state` is only the value selected by the second `useTable` argument.

State is feature-based. Registering `rowPaginationFeature` creates pagination state and APIs; without it, `pagination` must not exist in `initialState`, `state`, `atoms`, `table.atoms`, `table.store`, or `table.state`. Treat a missing state API as a likely missing feature import, not a typing problem.

Keep `features`, `data`, and `columns` stable. State subscriptions do not compensate for new model-input references on every render.

## Setup

```tsx
import {
  rowSelectionFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'

const features = tableFeatures({ rowSelectionFeature })

export function SelectionCount({
  data,
  columns,
}: {
  data: Array<{ id: string }>
  columns: any[]
}) {
  const table = useTable({ features, data, columns }, (state) => ({
    rowSelection: state.rowSelection,
  }))
  return <output>{Object.keys(table.state.rowSelection).length}</output>
}
```

The optional selector controls which state changes rerender the component and which selected fields appear on `table.state`. Omitting it selects all registered slices.

## Core Patterns

### Subscribe at the expensive boundary

```tsx
function SelectedRows({
  table,
}: {
  table: ReturnType<typeof useTable<typeof features, { id: string }>>
}) {
  return (
    <table.Subscribe selector={(state) => state.rowSelection}>
      {(rowSelection) => <output>{Object.keys(rowSelection).length}</output>}
    </table.Subscribe>
  )
}
```

At a top-level component holding the adapter's table instance, `table.Subscribe` selects from `table.store`. Use this after measuring or when React Compiler cannot see state reads hidden behind table builder methods.

### Control a slice with an external atom

```tsx
import { useCreateAtom } from '@tanstack/react-store'

const selection = useCreateAtom<Record<string, boolean>>({})
const table = useTable({
  features,
  columns,
  data,
  atoms: { rowSelection: selection },
})
```

An external atom is both ownership and subscription source; it avoids value-or-updater glue.

### Control a slice with React state

```tsx
const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
const table = useTable({
  features,
  columns,
  data,
  state: { rowSelection },
  onRowSelectionChange: setRowSelection,
})
```

## Choose State Ownership

Choose exactly one owner for each slice:

1. Use internal state by default and call feature APIs such as `table.setSorting`, `table.nextPage`, `column.toggleVisibility`, or `row.toggleSelected`.
2. Use `initialState.<slice>` only to set the starting and reset value. Changing `initialState` later does not reset the table.
3. Prefer a stable external atom in `atoms.<slice>` when Table, Query, routing, or another component must share the slice. Table APIs write that atom directly; do not also add `on[State]Change`.
4. Use `state.<slice>` plus its matching `on[State]Change` for simple React-controlled state or v8-style integrations. Always resolve both raw values and updater functions.

External atoms take precedence over external `state`; external `state` synchronizes into the internal base atom. Do not declare the same slice in multiple ownership options and rely on precedence as application logic. The global v8 `onStateChange` callback is gone in v9; control slices individually or subscribe to `table.store` to observe all state.

## Initialize, Update, and Reset

Prefer feature methods over direct atom writes because feature methods preserve related behavior. `table.baseAtoms.pagination.set(...)` is a low-level escape hatch only for internally owned state; write the supplied external atom when `atoms.pagination` owns the slice.

Feature reset methods reset to `table.initialState` by default:

```tsx
table.resetSorting()
table.resetPagination()
table.resetPagination(true) // feature blank/default state
```

Slice reset methods flow through that feature's updater and can update an external owner. Core `table.reset()` resets internal base atoms, so it is not the primary reset mechanism for externally owned atoms.

Use feature-specific types for owned slices and infer the full state from the feature set:

```tsx
import type { PaginationState, TableState } from '@tanstack/react-table'

type AppTableState = TableState<typeof features>
const initialPagination: PaginationState = { pageIndex: 0, pageSize: 20 }
```

## Common Mistakes

### HIGH Treating a snapshot as subscription

Wrong:

```tsx
const count = Object.keys(table.atoms.rowSelection.get()).length
```

Correct:

```tsx
const count = Object.keys(table.state.rowSelection).length
```

`atoms.*.get()` and `table.store.state` return current values but do not subscribe a React render.

Source: `packages/react-table/src/useTable.ts`

### HIGH Supplying only the change callback

Wrong:

```tsx
const table = useTable({
  features,
  columns,
  data,
  onRowSelectionChange: setRowSelection,
})
```

Correct:

```tsx
const table = useTable({
  features,
  columns,
  data,
  state: { rowSelection },
  onRowSelectionChange: setRowSelection,
})
```

Once a callback takes ownership, the corresponding controlled value must be written back.

Source: `docs/framework/react/guide/table-state.md`

### HIGH Hiding builder reads from React Compiler

Wrong:

```tsx
const SelectionCell = memo(({ row }) => (
  <input
    type="checkbox"
    checked={row.getIsSelected()}
    onChange={row.getToggleSelectedHandler()}
  />
))
```

Correct:

```tsx
import { Subscribe } from '@tanstack/react-table'

const SelectionCell = memo(({ row }) => (
  <Subscribe
    source={row.table.atoms.rowSelection}
    selector={(selection) => selection[row.id]}
  >
    {(selected) => (
      <input
        type="checkbox"
        checked={!!selected}
        onChange={row.getToggleSelectedHandler()}
      />
    )}
  </Subscribe>
))
```

`useTable` already returns a fresh table reference on state changes. The remaining hazard is a nested component receiving a stable row, cell, column, or header and hiding a state read behind its methods. Inside cell and header render contexts, `table` is typed as core `Table`, so import standalone `Subscribe`; use `source={table.store}` with a selector for multiple slices, or a specific atom for the narrowest boundary.

Source: `docs/framework/react/guide/table-state.md`

### MEDIUM Optimizing every cell preemptively

Wrong:

```tsx
<table.Subscribe source={table.atoms.rowSelection}>
  {() => <Cell cell={cell} />}
</table.Subscribe>
```

Correct:

```tsx
<Cell cell={cell} />
```

Default `useTable` state selection is the simpler starting point; introduce fine-grained boundaries where measurement or compiler behavior justifies them.

Source: `docs/framework/react/guide/table-state.md`

## API Discovery

Inspect `node_modules/@tanstack/react-table/dist/useTable.d.ts` and `Subscribe.d.ts`. Core atom precedence and state slices live under `node_modules/@tanstack/table-core/dist/`.
