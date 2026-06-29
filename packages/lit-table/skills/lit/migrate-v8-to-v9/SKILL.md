---
name: lit/migrate-v8-to-v9
description: >
  Mechanical breaking-change migration from TanStack Table v8 to v9 for
  `@tanstack/lit-table`. v8's `TableController(host, () => options)` shape
  collapses to v9's `new TableController(host)` + `.table(options, selector?)`;
  per-row-model `get*RowModel` options become `tableFeatures({...})` slots
  (row model factories live on the features object, not a separate `rowModels`
  map); `flexRender(def, ctx)` becomes `FlexRender({ cell|header|footer })`; core
  types gain a `TFeatures` first generic. Routing keywords: lit v8 to v9,
  migration, TableController v8, get*RowModel, features lit.
type: lifecycle
library: tanstack-table
framework: lit
library_version: '9.0.0-alpha.48'
requires:
  - setup
  - state-management
  - column-definitions
sources:
  - TanStack/table:docs/framework/lit/lit-table.md
  - TanStack/table:docs/framework/lit/guide/table-state.md
  - TanStack/table:docs/framework/react/guide/use-legacy-table.md
  - TanStack/table:packages/lit-table/src/TableController.ts
---

> **Maintainer note:** the Lit adapter is scheduled for a rewrite alongside TanStack Lit Store during the v9 beta cycle. APIs in this skill may change in a future beta. The patterns below match `9.0.0-alpha.48`.

The Lit v9 adapter mirrors v9's React surface (atoms, `features` with row model factory slots, FlexRender) wrapped in a `ReactiveController`. There is no `useLegacyTable` shim; migrate directly.

## The Core Mapping

| v8 (`@tanstack/lit-table`)                           | v9 (`@tanstack/lit-table`)                                                              |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `new TableController(host, () => options)`           | `new TableController<typeof features, TData>(host)` then `.table(options, selector?)`   |
| `controller.table` (property)                        | `controller.table(opts, selector?)` (method, called each `render()`)                    |
| `getCoreRowModel: getCoreRowModel()` option          | core row model included by default — no extra slot needed                               |
| `getSortedRowModel: getSortedRowModel()`             | `tableFeatures({ rowSortingFeature, sortedRowModel: createSortedRowModel(), sortFns })` |
| `getFilteredRowModel`, `getPaginationRowModel`, etc. | matching `*Feature` + matching row model factory slot in `tableFeatures({...})`         |
| `flexRender(def, ctx)`                               | `FlexRender({ cell })` / `FlexRender({ header })` / `FlexRender({ footer })`            |
| `state` + `on*Change` only                           | still supported; new `atoms` per-slice option preferred                                 |
| `createColumnHelper<TData>()`                        | `createColumnHelper<typeof features, TData>()`                                          |
| `ColumnDef<TData, TValue>`                           | `ColumnDef<TFeatures, TData, TValue>`                                                   |
| `Table<TData>`                                       | `Table<TFeatures, TData>`                                                               |

Source: `docs/framework/lit/lit-table.md`; `packages/lit-table/src/TableController.ts`.

## Migration Steps

### 1. Update the controller construction

```ts
// v8 — controller takes a thunk that returns options.
private tableController = new TableController(this, () => ({
  columns,
  data: this.data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
}))

protected render() {
  const table = this.tableController.table // property
  return html`...`
}
```

```ts
// v9 — controller takes only the host. Options pass to .table(...) inside render.
private tableController = new TableController<typeof features, Person>(this)

protected render() {
  const table = this.tableController.table(
    {
      features,
      columns,
      data: this.data,
    },
    () => ({}), // optional selector
  )

  return html`...`
}
```

### 2. Replace `get*RowModel` options with `tableFeatures({...})` slots

```ts
// v8
{
  columns, data,
  getCoreRowModel:       getCoreRowModel(),
  getSortedRowModel:     getSortedRowModel(),
  getFilteredRowModel:   getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
}

// v9 — row model factories and fn maps live on the features object
const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  sortedRowModel:    createSortedRowModel(),
  filteredRowModel:  createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
  filterFns,
})

{
  features,
  columns, data,
}
```

Move `features` to module scope. Reference identity matters.
Source: `docs/framework/lit/lit-table.md`.

### 3. Update column types and helpers

```ts
// v8
const columnHelper = createColumnHelper<Person>()
const columns: ColumnDef<Person>[] = columnHelper.columns([
  /* … */
])

// v9
const columnHelper = createColumnHelper<typeof features, Person>()
const columns: Array<ColumnDef<typeof features, Person>> = columnHelper.columns(
  [
    /* … */
  ],
)
```

`TFeatures` is now the first generic on `ColumnDef`, `Table`, and `createColumnHelper`.

### 4. Replace `flexRender` calls

```ts
// v8
<td>${flexRender(cell.column.columnDef.cell, cell.getContext())}</td>

// v9 — uses the FlexRender component
<td>${FlexRender({ cell })}</td>
<th>${FlexRender({ header })}</th>
<th>${FlexRender({ footer: header })}</th>
```

`FlexRender` handles grouping placeholder / aggregated branches when `columnGroupingFeature` is registered.

Source: `packages/lit-table/src/flexRender.ts`.

### 5. Move to slice atoms (optional but preferred)

```ts
// v8 / v9 fallback — @state() field + onStateChange
@state() private _sorting: SortingState = []

protected render() {
  const table = this.tableController.table({
    /* … */,
    state: { sorting: this._sorting },
    onSortingChange: (u) => {
      this._sorting = u instanceof Function ? u(this._sorting) : u
    },
  })
}

// v9 preferred — external atom (per-slice ownership, no on*Change needed)
import { createAtom } from '@tanstack/store'

const sortingAtom = createAtom<SortingState>([])

protected render() {
  const table = this.tableController.table({
    /* … */,
    atoms: { sorting: sortingAtom },
  })
}
```

Source: `examples/lit/basic-external-atoms/src/main.ts`.

### 6. Drop `onStateChange`

The v8-style global `onStateChange` is gone. Subscribe per-slice with `on*Change`, an external atom, or `table.store.subscribe(...)` if you really need every change.

## Common Mistakes

### CRITICAL Keeping the v8 controller-with-thunk shape

Wrong:

```ts
// v8 shape — `controller.table` was a property
private tableController = new TableController(this, () => ({ columns, data: this.data }))

protected render() {
  const table = this.tableController.table // no longer a property in v9
}
```

Correct: drop the thunk; call `.table(options, selector?)` each render.
Source: `packages/lit-table/src/TableController.ts`.

### CRITICAL Keeping `get*RowModel` options after upgrading

Wrong:

```ts
this.tableController.table({
  features,
  columns,
  data,
  getSortedRowModel: getSortedRowModel(), // ignored
})
```

Correct:

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
this.tableController.table({
  features,
  columns,
  data,
})
```

v9 doesn't read `get*RowModel` options. Features and their row model factories are registered together in `tableFeatures({...})`.

### CRITICAL Calling a feature API without registering the feature

Wrong:

```ts
const features = tableFeatures({}) // no rowSelectionFeature
const table = this.tableController.table({
  features,
  columns,
  data,
})
table.getIsAllRowsSelected() // type error / runtime no-op
```

Correct:

```ts
const features = tableFeatures({ rowSelectionFeature })
const table = this.tableController.table({
  features,
  columns,
  data,
  enableRowSelection: true,
})
```

This is the #1 v9 trap.
Source: `docs/guide/features.md`.

### HIGH Re-using `getCoreRowModel: getCoreRowModel()`

Wrong: still passing `getCoreRowModel` — v9 includes the core row model automatically.

Correct: drop it. The core row model is always included automatically.

### HIGH Single-generic column helper / `ColumnDef`

Wrong:

```ts
const columnHelper = createColumnHelper<Person>()
const columns: ColumnDef<Person>[] = [
  /* … */
]
```

Correct:

```ts
const columnHelper = createColumnHelper<typeof features, Person>()
const columns: Array<ColumnDef<typeof features, Person>> = [
  /* … */
]
```

### HIGH Reimplementing built-ins

Wrong: hand-rolled sort/filter/pagination outside the table — #1 AI tell.

Correct: register the matching feature + factory and use the feature APIs.
Source: `docs/guide/features.md`.

### MEDIUM Calling `flexRender` directly when grouping is registered

Wrong: `flexRender(cell.column.columnDef.cell, cell.getContext())` for an aggregated/placeholder cell.

Correct: use `FlexRender({ cell })` — it handles the aggregated/placeholder branches when `columnGroupingFeature` is registered.

## See Also

- `tanstack-table/lit/getting-started` — green-field v9 setup.
- `tanstack-table/lit/lit-table-controller` — controller lifecycle in depth.
- `tanstack-table/lit/table-state` — atoms, Subscribe, createTableHook.
