---
name: state-management
description: >
  Coordinate TanStack Table v9 state across `initialState`, controlled
  `state`+`on*Change`, and external `atoms`. Covers the atom model
  (`table.atoms.<slice>`, `table.baseAtoms.<slice>`, `table.store`, `table.state`),
  per-slice precedence (atoms beat state beat initialState beat baseAtoms),
  `manualSorting` / `manualFiltering` / `manualPagination` / `manualGrouping` /
  `manualExpanding` for server-side data, `autoResetPageIndex` / `autoResetAll`,
  reset APIs (`resetSorting`, `resetPagination`, `reset()`), and the
  `SortingState` / `PaginationState` / `RowSelectionState` / `ColumnFiltersState` /
  `GroupingState` shapes. Foundational for every other skill.
type: core
library: tanstack-table
library_version: '9.0.0-alpha.48'
sources:
  - TanStack/table:docs/framework/vanilla/guide/table-state.md
  - TanStack/table:docs/framework/react/guide/table-state.md
  - TanStack/table:packages/table-core/src/store-reactivity-bindings.ts
  - TanStack/table:packages/table-core/src/reactivity.ts
  - TanStack/table:packages/table-core/src/core/table/constructTable.ts
---

## Setup

TanStack Table v9 is built on TanStack Store. Each state slice (sorting, pagination, columnFilters, rowSelection, columnVisibility, …) is a separate atom. There are four ownership patterns, and the table reads from them in a fixed precedence.

```ts
import {
  constructTable,
  tableFeatures,
  rowSortingFeature,
  rowPaginationFeature,
  createSortedRowModel,
  createPaginatedRowModel,
  sortFns,
} from '@tanstack/table-core'

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
})

const table = constructTable({
  features,
  columns,
  data,
  // 1. initialState — set starting values; read once at construction
  initialState: {
    sorting: [{ id: 'lastName', desc: false }],
    pagination: { pageIndex: 0, pageSize: 10 },
  },
})

// Read APIs:
table.store.state // flat snapshot of every slice (no subscription)
table.atoms.sorting.get() // single-slice atom read (no subscription)
table.state // typed output of the `useTable` selector (framework adapters)

// Write APIs use the feature setters — they're atom-aware:
table.setSorting([{ id: 'firstName', desc: true }])
table.setPageIndex(2)
```

The four ownership patterns per slice:

| Pattern                             | When to use                                          | Wins over                       |
| ----------------------------------- | ---------------------------------------------------- | ------------------------------- |
| internal (default)                  | Most slices in a simple table                        | nothing — baseline              |
| `initialState.<slice>`              | Set starting value only                              | internal default                |
| `state.<slice>` + `on<Slice>Change` | v8-style controlled state                            | `initialState`                  |
| `atoms.<slice>`                     | v9 preferred — share with other components / queries | `state`+`on*Change` (silently!) |

## Core Patterns

### Internal state with `initialState`

```ts
const table = constructTable({
  features,
  columns,
  data,
  initialState: { sorting: [{ id: 'age', desc: false }] },
})
// State lives entirely inside the table.
table.setSorting([{ id: 'firstName', desc: true }])
```

### Controlled state with `state` + `on*Change` (v8-style)

```tsx
const [sorting, setSorting] = React.useState<SortingState>([])

const table = useTable({
  features,
  columns,
  data,
  state: { sorting },
  onSortingChange: setSorting,
})
```

`state` and `on*Change` must be paired. Without the callback the table cannot update React state, so toggling sort appears to do nothing.

### External atom (v9 preferred for shared slices)

```tsx
import { useCreateAtom } from '@tanstack/react-store'

function MyTable() {
  // Hoist or pass via context to share with queries / other components.
  const paginationAtom = useCreateAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useTable({
    features,
    columns,
    data,
    atoms: { pagination: paginationAtom },
    // no state.pagination, no onPaginationChange needed
  })

  return <Pager paginationAtom={paginationAtom} />
}
```

The atom IS the source of truth; `table.atoms.pagination` derives from it.

### Server-side / manual mode

```tsx
const [pagination, setPagination] = React.useState({
  pageIndex: 0,
  pageSize: 10,
})
const dataQuery = useQuery({
  queryKey: ['rows', pagination],
  queryFn: () => fetchPage(pagination),
})

const table = useTable({
  features: tableFeatures({ rowPaginationFeature }),
  // no paginatedRowModel registered — server paginates
  columns,
  data: dataQuery.data?.rows ?? EMPTY,
  rowCount: dataQuery.data?.rowCount, // server tells the table the total
  state: { pagination },
  onPaginationChange: setPagination,
  manualPagination: true, // ← tell the table to NOT re-paginate
})
```

The same shape applies to `manualSorting`, `manualFiltering`, `manualGrouping`, `manualExpanding`. Without the flag, the table re-applies its client-side pipeline on top of already-prepared server data.

## Common Mistakes

### [CRITICAL] Passing both `state.<slice>` and `atoms.<slice>`

Wrong:

```tsx
// both ownership paths for the same slice
const paginationAtom = useCreateAtom<PaginationState>({ pageIndex: 0, pageSize: 10 })
const [pagination, setPagination] = React.useState(...)

const table = useTable({
  features,
  columns,
  data,
  state: { pagination },                  // ignored
  onPaginationChange: setPagination,
  atoms: { pagination: paginationAtom },  // wins
})
```

Correct:

```tsx
// pick one ownership path per slice — here, external atoms
const paginationAtom = useCreateAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = useTable({
  features,
  columns,
  data,
  atoms: { pagination: paginationAtom },
})
```

When both are supplied, the external atom wins silently. `state.pagination` becomes dead config and `setPagination` writes never reach the table.

Source: docs/framework/react/guide/table-state.md; packages/table-core/src/core/table/constructTable.ts

### [CRITICAL] Using external `state` without the matching `on*Change` callback

Wrong:

```tsx
const [sorting, setSorting] = React.useState<SortingState>([])
const table = useTable({
  features,
  columns,
  data,
  state: { sorting }, // no onSortingChange
})
```

Correct:

```tsx
const [sorting, setSorting] = React.useState<SortingState>([])
const table = useTable({
  features,
  columns,
  data,
  state: { sorting },
  onSortingChange: setSorting,
})
```

The table keeps reading from `state.sorting`, so the UI looks stuck — sort toggles never make it back into React state.

Source: docs/framework/react/guide/table-state.md; examples/react/basic-external-state/src/main.tsx

### [HIGH] Using `initialState` to control or update state

Wrong:

```tsx
// updates to initialState are ignored after first render
function MyTable({ defaultSort }: { defaultSort: SortingState }) {
  const table = useTable({
    features,
    columns,
    data,
    initialState: { sorting: defaultSort }, // later changes never sync
  })
}
```

Correct:

```tsx
function MyTable({ defaultSort }: { defaultSort: SortingState }) {
  const [sorting, setSorting] = React.useState(defaultSort)
  const table = useTable({
    features,
    columns,
    data,
    state: { sorting },
    onSortingChange: setSorting,
  })
}
```

`initialState` is read once at construction to seed `baseAtoms`. Mutating it later does nothing.

Source: docs/framework/vanilla/guide/table-state.md; docs/framework/react/guide/table-state.md

### [HIGH] Writing to `table.baseAtoms.<slice>` while `atoms.<slice>` owns the slice

Wrong:

```ts
const paginationAtom = useCreateAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const table = useTable({
  features,
  columns,
  data,
  atoms: { pagination: paginationAtom },
})

table.baseAtoms.pagination.set((old) => ({ ...old, pageIndex: 0 }))
// baseAtom updated, but table.atoms.pagination still reads from paginationAtom
```

Correct:

```ts
// Write to the external atom directly, OR use the feature's setter API
paginationAtom.set((old) => ({ ...old, pageIndex: 0 }))
// or
table.setPageIndex(0) // setter writes through the slice's updater (atom-aware)
```

When an external atom owns a slice, `table.atoms.<slice>` derives from it — not from `baseAtoms`. Direct base-atom writes drift and never surface in the UI.

Source: docs/framework/vanilla/guide/table-state.md; packages/table-core/src/core/table/constructTable.ts

### [CRITICAL] Forgetting `manualSorting` / `manualFiltering` / `manualPagination` for server-side data

Wrong:

```tsx
// data is already paginated server-side, but table still slices it
const dataQuery = useQuery({
  queryKey: ['data', pagination],
  queryFn: fetchPage,
})
// features has paginatedRowModel registered
const table = useTable({
  features,
  columns,
  data: dataQuery.data?.rows ?? [],
  rowCount: dataQuery.data?.rowCount,
  atoms: { pagination: paginationAtom },
  // ❌ missing manualPagination: true
})
```

Correct:

```tsx
// Use features WITHOUT paginatedRowModel for fully server-side pagination
const table = useTable({
  features: tableFeatures({ rowPaginationFeature }),
  columns,
  data: dataQuery.data?.rows ?? [],
  rowCount: dataQuery.data?.rowCount,
  atoms: { pagination: paginationAtom },
  manualPagination: true,
})
```

Without the manual flag, the table re-applies its client-side row models on top of already-prepared server data — wrong rows, broken page math, blank pages.

Source: docs/framework/react/guide/table-state.md; packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts

### [HIGH] Using `table.reset()` to clear externally owned state

Wrong:

```ts
// external atom keeps its current value; only baseAtoms reset
const sortingAtom = useCreateAtom<SortingState>([])
const table = useTable({
  features,
  columns,
  data,
  atoms: { sorting: sortingAtom },
})
table.reset() // sortingAtom is NOT cleared
```

Correct:

```ts
// Use feature-specific reset — atom-aware
table.resetSorting()
// or, to clear the external atom specifically:
sortingAtom.set([])
```

`table.reset()` only resets `baseAtoms` to `initialState`; slices owned by external atoms or external `state` are untouched. The atom split makes `reset()` less safe than v8.

Source: docs/framework/vanilla/guide/table-state.md; packages/table-core/src/core/table/coreTablesFeature.utils.ts

### [CRITICAL] Reimplementing what built-in setters provide

Wrong:

```ts
// Reimplements sorting state manually instead of using the API
const [sorting, setSorting] = useState([])
const sortedData = useMemo(() => [...data].sort(/* ... */), [data, sorting])
// then uses sortedData directly, bypassing the table
```

Correct:

```ts
const table = useTable({
  features: tableFeatures({
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns,
  }),
  columns,
  data,
})
// table.setSorting(...), column.toggleSorting(), header.getToggleSortingHandler()
```

The setters honor reset behavior, multi-sort, internal invariants. Hand-rolled state loops skip all of that.

Source: maintainer interview (Phase 4, 2026-05-17)

## See also

- `tanstack-table/setup` — how `features` (with row model factory and fn slots) is wired
- `tanstack-table/pagination`, `tanstack-table/sorting`, `tanstack-table/filtering` — feature-specific `manual*` and reset semantics
- `tanstack-table/migrate-v8-to-v9` — `table.getState()` → `table.store.state` / `table.atoms.<slice>.get()`
