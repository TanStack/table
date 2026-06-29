---
name: react/getting-started
description: >
  End-to-end first-table journey for `@tanstack/react-table` v9. Install the
  React adapter, declare `features` via `tableFeatures()` (row model factories
  and *Fns registries live on the features object alongside feature flags),
  create a column helper with both `TFeatures` and `TData` generics, instantiate
  `useTable`, and render with `<table.FlexRender>`. New users land here, not on
  `useLegacyTable`.
type: lifecycle
library: tanstack-table
framework: react
library_version: '9.0.0-alpha.48'
requires:
  - setup
  - column-definitions
  - state-management
  - react/table-state
sources:
  - TanStack/table:docs/installation.md
  - TanStack/table:docs/framework/react/react-table.md
  - TanStack/table:examples/react/basic-use-table/src/main.tsx
  - TanStack/table:examples/react/basic-use-app-table/src/main.tsx
---

This skill builds on `tanstack-table/state-management` and `tanstack-table/react/table-state`. Read those first — `features` (including row model factories) comes from the core state-management concept, and `table-state` covers how reactivity flows in React.

## Install

```bash
pnpm add @tanstack/react-table
# or
npm install @tanstack/react-table
```

`@tanstack/react-table` v9 requires React 18+ and TypeScript 5.4+ if you use TS.

## Minimum-viable v9 table

Three things are non-negotiable, even for the simplest possible table:

1. `features: tableFeatures({...})` — required even if empty (`tableFeatures({})`). Row model factories and \*Fns registries live on this object alongside feature flags.
2. `createColumnHelper<typeof features, TData>()` — generic order is `<TFeatures, TData>` in v9 (changed from v8).
3. The **core** row model is automatic; register sorted/filtered/paginated/grouped/etc. models by adding their factory to `tableFeatures(...)` when you use them.

```tsx
import * as React from 'react'
import { useTable, tableFeatures } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

// 1. features — required option, even if empty.
const features = tableFeatures({})

// 2. Columns — defined at module scope for stable identity.
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'visits', header: 'Visits' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'progress', header: 'Profile Progress' },
]

function App({ initialData }: { initialData: Person[] }) {
  const [data] = React.useState(() => initialData)

  // 3. Build the table — features is required; row model factories go on features when used.
  const table = useTable(
    {
      features,
      columns,
      data,
    },
    (state) => state, // default selector
  )

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((h) => (
              <th key={h.id}>
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
    </table>
  )
}
```

Source: `examples/react/basic-use-table/src/main.tsx`.

## Adding sorting

Register the feature and its row model factory on the `features` object, then wire a click handler:

```tsx
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
  createColumnHelper,
} from '@tanstack/react-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First' }),
  columnHelper.accessor('age', { header: 'Age' }),
])

function App({ data }: { data: Person[] }) {
  const table = useTable({
    features,
    columns,
    data,
  })

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((h) => (
              <th key={h.id} onClick={h.column.getToggleSortingHandler()}>
                <table.FlexRender header={h} />
                {{ asc: ' 🔼', desc: ' 🔽' }[
                  h.column.getIsSorted() as string
                ] ?? null}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {/* tbody same as above */}
    </table>
  )
}
```

The `sortFns` slot is what makes the built-in sort functions tree-shakeable. Register the equivalent fns slots (`filterFns` for `createFilteredRowModel()`, `aggregationFns` for `createGroupedRowModel()`) when using those features.

## Layering features

Adding pagination and filtering is purely additive — register each feature, its factory, and its fns registry on `tableFeatures(...)`, then call the built-in APIs:

```tsx
const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
  filterFns,
})

const table = useTable({
  features,
  columns,
  data,
})

// Built-in APIs you should reach for, NOT reimplement:
table.setSorting([{ id: 'age', desc: true }])
table.nextPage()
table.setColumnFilters([{ id: 'firstName', value: 'tan' }])
column.toggleSorting()
row.toggleSelected()
```

Source: `docs/framework/react/react-table.md`; `examples/react/basic-use-table/src/main.tsx`.

## Optional: `createTableHook` for shared config

If you ship the same `features` / row model factories / cell components across many tables, package them once:

```tsx
import { createTableHook } from '@tanstack/react-table'

const { useAppTable, createAppColumnHelper } = createTableHook({
  features: {},
  debugTable: true,
})

const columnHelper = createAppColumnHelper<Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { cell: (info) => info.getValue() }),
])

function App({ data }) {
  const table = useAppTable({ columns, data })
  // ... same FlexRender markup
}
```

Source: `examples/react/basic-use-app-table/src/main.tsx`.

## Common Mistakes

### CRITICAL Forgetting `features: tableFeatures({})`

Wrong:

```tsx
const table = useTable({
  columns,
  data,
})
// TS: Property 'features' is missing in type
```

Correct:

```tsx
const features = tableFeatures({})
const table = useTable({ features, columns, data })
```

The option is required even for a "no features" table — pass `tableFeatures({})` or `stockFeatures` if you want v8-style "everything on".
Source: `examples/react/basic-use-table/src/main.tsx`.

### CRITICAL Reimplementing what built-in APIs already provide

Wrong:

```tsx
// Reimplements sorting state manually instead of using the API.
const [sorting, setSorting] = useState([])
const sortedData = useMemo(
  () => [...data].sort((a, b) => /* custom */),
  [data, sorting],
)
// uses sortedData directly, bypassing the table
```

Correct:

```tsx
const table = useTable({
  features: tableFeatures({
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns,
  }),
  columns,
  data,
})
// Then: table.setSorting(...), column.toggleSorting(), header.getToggleSortingHandler()
```

Maintainer flags this as the #1 tell that "an AI wrote this." The built-ins handle reset semantics, multi-sort, internal invariants.
Source: maintainer interview (Phase 4).

### CRITICAL API "missing" because the feature was not registered in `features`

Wrong:

```tsx
const features = tableFeatures({}) // empty
const table = useTable({ features, columns, data })
table.setSorting([{ id: 'age', desc: true }]) // TS error — does not exist on this table type
```

Correct:

```tsx
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const table = useTable({
  features,
  columns,
  data,
})
table.setSorting([{ id: 'age', desc: true }]) // ✓
```

In v9, `features` is a tree-shakeable registry. If a feature isn't listed, TypeScript hides its APIs and the runtime atom is never created — the feature isn't broken, it's just not on.
Source: maintainer interview (Phase 4); `docs/framework/react/react-table.md`.

### HIGH Wrong generic order on `createColumnHelper`

Wrong:

```tsx
const columnHelper = createColumnHelper<Person>() // v8 arity
```

Correct:

```tsx
const features = tableFeatures({
  /* … */
})
const columnHelper = createColumnHelper<typeof features, Person>() // v9: <TFeatures, TData>
```

v9 added `TFeatures` as the first generic across `Column`, `Row`, `ColumnDef`, `ColumnMeta`, etc. Use `typeof features` so the same feature set drives types and runtime.
Source: `docs/framework/react/react-table.md`.

### HIGH Defining `features` / `columns` / `data` inside the render body

Wrong:

```tsx
function MyTable({ rows }) {
  const features = tableFeatures({ rowSortingFeature })  // new every render
  const columns = [/* … */]                                // new every render
  return <Table {/* … */} />
}
```

Correct:

```tsx
// Module scope = stable identity.
const features = tableFeatures({ rowSortingFeature })
const columns: ColumnDef<typeof features, Person>[] = [
  /* … */
]
```

Internal memoization keys off identity. A new object every render forces full recomputation and can cause subtle re-render issues.
Source: `examples/react/basic-use-table/src/main.tsx`; FAQ #1.

### HIGH Reaching for `useLegacyTable` for a new project

Wrong:

```tsx
import { useLegacyTable, getCoreRowModel } from '@tanstack/react-table/legacy'
const table = useLegacyTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
})
```

Correct:

```tsx
import { useTable, tableFeatures } from '@tanstack/react-table'
const features = tableFeatures({})
const table = useTable({ features, columns, data })
```

`useLegacyTable` is a migration shim for incrementally upgrading v8 codebases. It bundles every feature, lacks `table.Subscribe`, and is deprecated in v9 / scheduled for removal in v10. New code uses `useTable`.
Source: `docs/framework/react/guide/use-legacy-table.md`.

## See Also

- `tanstack-table/react/table-state` — selectors, `<Subscribe>`, external atoms, `createTableHook`.
- `tanstack-table/react/migrate-v8-to-v9` — for codebases upgrading from `useReactTable`.
- `tanstack-table/react/production-readiness` — once it works, optimize for shipping.
- `tanstack-table/react/client-to-server` — when you outgrow client-side row processing.
