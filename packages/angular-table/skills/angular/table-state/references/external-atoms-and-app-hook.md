# External Atoms & `createTableHook` — Full Reference

Extended ownership options beyond signals + `state` + `on[State]Change`.

---

## External TanStack Store atoms — alternative ownership

The core `atoms` table option is re-exported from Angular Table. Use it when:

- You already have a `Store` / `Atom` from `@tanstack/store` or
  `@tanstack/angular-store` that should drive a table slice.
- Multiple non-table parts of the app need to read/write the slice through the
  same atom (e.g. URL sync, persistence, multi-table coordination).

**For most Angular apps, prefer signals + `state` first.** Atoms are the
cross-app sharing alternative, not the default. See
`compose-with-tanstack-store` for the full pattern.

```ts
import { Store } from '@tanstack/store'

const paginationAtom = new Store<PaginationState>({ pageIndex: 0, pageSize: 10 })

readonly table = injectTable(() => ({
  features,
  columns,
  data: this.data(),
  atoms: {
    pagination: paginationAtom, // external atom owns the slice
  },
}))
```

When `atoms.pagination` is registered, `table.atoms.pagination.get()` reads from
the external atom (not the internal base atom). `table.setPagination(...)`
writes through the external atom's setter.

---

## State types

Import slice types directly from `@tanstack/angular-table`:

```ts
import type {
  PaginationState,
  SortingState,
  RowSelectionState,
  ColumnFiltersState,
  GlobalFilterTableState,
  ColumnVisibilityState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ColumnResizingState,
  ExpandedState,
  GroupingState,
  TableState,
} from '@tanstack/angular-table'

// TableState<typeof features> is inferred from registered features
type MyTableState = TableState<typeof features>
```

---

## `createTableHook` — app-wide table infrastructure

When multiple tables in an app share the same `features` object and
component conventions, factor them into a `createTableHook(...)` call once and
import the resulting `injectAppTable` / `createAppColumnHelper`.

```ts
// app-table.ts
import {
  createTableHook,
  tableFeatures,
  rowSortingFeature,
  rowPaginationFeature,
  createSortedRowModel,
  createPaginatedRowModel,
  sortFns,
} from '@tanstack/angular-table'

export const {
  injectAppTable,
  createAppColumnHelper,
  injectTableContext,
  injectTableCellContext,
  injectTableHeaderContext,
} = createTableHook({
  features: tableFeatures({
    rowSortingFeature,
    rowPaginationFeature,
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortFns,
  }),
  getRowId: (row) => row.id,
})
```

Then in components:

```ts
import { injectAppTable, createAppColumnHelper } from './app-table'

const columnHelper = createAppColumnHelper<Person>() // only TData generic needed

readonly table = injectAppTable(() => ({
  columns,
  data: this.data(),
})) // features (including row-model factories) inherited
```

`createTableHook` also lets you register `tableComponents` / `cellComponents` /
`headerComponents` registries — see `angular-rendering-directives` for that.

---

## Lower-severity failure modes (MEDIUM/LOW)

### Using `state.x` and `atoms.x` together for the same slice

External atom silently wins. If you intended Angular-signal ownership, remove
`atoms.x` (or vice versa). Pick exactly one source of truth per slice.

### Forgetting the updater function form in `on[State]Change`

```ts
// ❌ Crashes when TanStack Table passes a function
onSortingChange: (value) => this.sorting.set(value)

// ✅
onSortingChange: (updater) => {
  updater instanceof Function
    ? this.sorting.update(updater)
    : this.sorting.set(updater)
}
```

### Mutating `state` slice values in place

`state: { sorting: this.sorting() }` snapshots the current value. Mutating the
underlying signal value with `.push()` won't trigger re-evaluation. Always
produce a new reference: `this.sorting.update(s => [...s, newSort])`.

### Premature `computed` selector wrapping for a single read

For a single atom read in a template (`{{ table.atoms.pagination.get().pageIndex }}`),
a wrapper `computed` adds no value. Reach for `computed` only for derivation,
shared selectors, or `{ equal: shallow }`.
