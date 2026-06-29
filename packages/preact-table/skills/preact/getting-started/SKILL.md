---
name: preact/getting-started
description: >
  End-to-end first-table journey for `@tanstack/preact-table` v9: install the
  adapter, declare `features` via `tableFeatures()` with row model factories
  and *Fns slots on the features object, build a typed column helper, call
  `useTable` with stable references, and render with `table.FlexRender`.
  Routing keywords: install preact-table, first table, getting started,
  tableFeatures, features, useTable, FlexRender, basic-use-table.
type: lifecycle
library: tanstack-table
framework: preact
library_version: '9.0.0-alpha.48'
requires:
  - setup
  - column-definitions
  - state-management
  - preact/table-state
sources:
  - TanStack/table:docs/installation.md
  - TanStack/table:docs/framework/preact/preact-table.md
  - TanStack/table:examples/preact/basic-use-table/src/main.tsx
  - TanStack/table:packages/preact-table/src/useTable.ts
---

This skill walks through a first working Preact v9 table end-to-end. It assumes you have read `tanstack-table/setup` and `tanstack-table/state-management` for core concepts and `tanstack-table/preact/table-state` for adapter wiring.

## Install

`@tanstack/preact-table` is the Preact adapter. It pulls in `@tanstack/table-core` and `@tanstack/preact-store` (used internally for atom-backed state).

```bash
npm install @tanstack/preact-table
```

Peer dependency: `preact >=10`.

Source: `packages/preact-table/package.json`.

## Step 1 — Declare `features`

v9 is explicit about what a table uses. `features` is a registry of every feature the table needs. Use `tableFeatures({...})` to get an object whose TypeScript shape drives state inference, API surface, and tree-shaking.

```tsx
import {
  tableFeatures,
  rowPaginationFeature,
  rowSortingFeature,
} from '@tanstack/preact-table'

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  // row model factories and *Fns slots are added here in Step 2
})
```

If `features` does not include `rowSelectionFeature`, then `table.atoms.rowSelection`, `table.setRowSelection`, `table.getIsAllRowsSelected()`, etc. all become TypeScript errors — and the runtime won't ship that logic. Pass `tableFeatures({})` for a minimum-overhead table with just the core row model.

Source: `docs/framework/preact/preact-table.md`; `docs/guide/features.md`.

## Step 2 — Register row model factories on `features`

Each registered feature that needs a row-model stage maps to a factory added directly to the `tableFeatures({...})` call. Pass \*Fns maps (predicates, comparators, etc.) as slots on the same object.

```tsx
import {
  tableFeatures,
  rowPaginationFeature,
  rowSortingFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  sortFns,
} from '@tanstack/preact-table'

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
```

The core row model is always included. A `tableFeatures({})` call with no row-model factories is valid for a feature-free table.

Source: `docs/framework/preact/preact-table.md`.

## Step 3 — Type your data and build columns

Declare your row shape once and feed it to `createColumnHelper<typeof features, TData>()`. This is the type-safe path; `ColumnDef<typeof features, Person>[]` also works.

```tsx
import { createColumnHelper, type ColumnDef } from '@tanstack/preact-table'

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lastName', { header: () => <span>Last Name</span> }),
  columnHelper.accessor('age', { header: 'Age' }),
  columnHelper.accessor('visits', { header: 'Visits' }),
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('progress', { header: 'Profile Progress' }),
])
```

Source: `examples/preact/basic-use-table/src/main.tsx`.

## Step 4 — Call `useTable` and render

`useTable` takes options and an optional selector. Render headers, cells, and footers with `table.FlexRender` so column defs can be strings or Preact components.

```tsx
import { render } from 'preact'
import { useState } from 'preact/hooks'
import { useTable } from '@tanstack/preact-table'

const defaultData: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'kevin',
    lastName: 'vandy',
    age: 12,
    visits: 100,
    status: 'Single',
    progress: 70,
  },
]

function App() {
  const [data] = useState(() => [...defaultData])

  const table = useTable(
    {
      features,
      columns,
      data,
      debugTable: true,
    },
    (state) => state, // default selector
  )

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((h) => (
              <th key={h.id} onClick={h.column.getToggleSortingHandler()}>
                {h.isPlaceholder ? null : <table.FlexRender header={h} />}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getAllCells().map((cell) => (
              <td key={cell.id}>
                <table.FlexRender cell={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        {table.getFooterGroups().map((fg) => (
          <tr key={fg.id}>
            {fg.headers.map((h) => (
              <th key={h.id}>
                {h.isPlaceholder ? null : <table.FlexRender footer={h} />}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  )
}

render(<App />, document.getElementById('root')!)
```

Source: `examples/preact/basic-use-table/src/main.tsx`.

## Step 5 — Drive features with feature APIs

Reach for `table.setSorting(...)`, `table.setPageIndex(...)`, `table.nextPage()`, `column.toggleVisibility()`, `row.toggleSelected()`, etc. — never edit `table.state` directly.

```tsx
<button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>First</button>
<button onClick={() => table.nextPage()}      disabled={!table.getCanNextPage()}>Next</button>
```

For starting values, use `initialState`. For controlled slices, use `atoms` (preferred) or `state` + `on*Change` — see `tanstack-table/preact/table-state`.

## Common Mistakes

### CRITICAL Calling a feature API when the feature is not in `features`

Wrong:

```tsx
const features = tableFeatures({}) // no rowPaginationFeature
const table = useTable({ features, columns, data })

table.setPageIndex(0) // TypeScript error AND runtime no-op
```

Correct:

```tsx
const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})
const table = useTable({ features, columns, data })

table.setPageIndex(0)
```

v9 generates feature APIs and state slices only for registered features. The missing-feature failure mode (calling `setSorting`, accessing `state.pagination`, etc. before registering the feature) is the #1 v9 trap.
Source: `docs/guide/features.md`; `docs/framework/preact/guide/table-state.md`.

### HIGH Forgetting the matching row-model factory

Wrong:

```tsx
const features = tableFeatures({ rowSortingFeature }) // no sortedRowModel
const table = useTable({ features, columns, data })
table.setSorting([{ id: 'age', desc: true }])
// table.getRowModel().rows is still unsorted — no sortedRowModel registered
```

Correct:

```tsx
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const table = useTable({ features, columns, data })
```

Each row-model feature (sorting, filtering, pagination, grouping, expanding, faceting) requires its row-model factory registered in `tableFeatures` to actually transform the rows.
Source: `docs/framework/preact/preact-table.md`.

### HIGH Unstable `features` / `columns` / `data` references

Wrong:

```tsx
function MyTable({ rows }) {
  const features = tableFeatures({ rowSortingFeature }) // new every render
  const columns = [
    /* … */
  ] // new every render
  const data = rows ?? [] // new [] every render
  const table = useTable({ features, columns, data })
}
```

Correct:

```tsx
const features = tableFeatures({ rowSortingFeature })
const columns: ColumnDef<typeof features, Person>[] = [
  /* … */
]
const EMPTY: Person[] = []

function MyTable({ rows }) {
  const data = rows ?? EMPTY
  const table = useTable({ features, columns, data })
}
```

Internal memos key off identity. Fresh references bust everything every render.
Source: `docs/framework/preact/guide/table-state.md` (FAQ #1).

### HIGH Reimplementing built-in feature logic

Wrong:

```tsx
const sorted = useMemo(() => [...data].sort(/* … */), [data, sorting]) // duplicates rowSortingFeature
```

Correct:

```tsx
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const table = useTable({ features, columns, data })
const rows = table.getRowModel().rows // already sorted
```

v9 ships built-ins for sorting, filtering, pagination, grouping, expanding, faceting, row selection, column visibility/order/pinning/sizing, and row pinning. Use them.
Source: `docs/guide/features.md`.

### MEDIUM Using v8 hook names (`getCoreRowModel`, `useReactTable`, etc.)

Wrong:

```tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/preact-table'
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

Correct:

```tsx
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
} from '@tanstack/preact-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const table = useTable({ features, columns, data })
```

v8 used `useReactTable` and `get*RowModel` options. v9 uses `useTable` with `features` (which now also carries row model factories and \*Fns slots). See `tanstack-table/preact/migrate-v8-to-v9` for the full mapping.
Source: `docs/framework/preact/preact-table.md`.

## See Also

- `tanstack-table/preact/table-state` — atoms, Subscribe, createTableHook.
- `tanstack-table/preact/migrate-v8-to-v9` — moving an existing v8 codebase over.
- `tanstack-table/preact/production-readiness` — perf, tree-shaking, stable refs.
