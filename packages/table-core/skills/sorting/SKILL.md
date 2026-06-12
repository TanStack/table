---
name: sorting
description: >
  Sort rows in TanStack Table v9 with the `sortedRowModel` stage. Covers
  `rowSortingFeature` + `createSortedRowModel()` (registered on `features`), the built-in `sortFns`
  registry (renamed from v8 `sortingFns`), `state.sorting` (SortingState =
  Array<{ id, desc }>), `onSortingChange`, `columnDef.sortFn`
  (string | function | 'auto'), `sortDescFirst`, `sortUndefined`
  ('first'|'last'|-1|1|false), `invertSorting`, `enableMultiSort`,
  `maxMultiSortColCount`, `isMultiSortEvent`, `table.setSorting` /
  `resetSorting`, `column.getToggleSortingHandler` /
  `getNextSortingOrder` / `clearSorting` / `getCanSort` / `getCanMultiSort`,
  `manualSorting` for server-side, and fuzzy `compareItems` pairing.
type: core
library: tanstack-table
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - customizing-feature-behavior
sources:
  - TanStack/table:docs/guide/sorting.md
  - TanStack/table:packages/table-core/src/fns/sortFns.ts
  - TanStack/table:packages/table-core/src/features/row-sorting/createSortedRowModel.ts
  - TanStack/table:packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts
  - TanStack/table:examples/react/sorting/src/main.tsx
---

This skill builds on `tanstack-table/state-management` and `tanstack-table/customizing-feature-behavior`. Read those first for the atom model and `sortFn` overrides.

## Setup

```ts
import {
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
  createColumnHelper,
  constructTable,
} from '@tanstack/table-core'
import type { SortingState } from '@tanstack/table-core'

type Person = {
  firstName: string
  lastName: string
  age: number
  status: 'single' | 'complicated' | 'relationship'
}

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { sortFn: 'alphanumeric' }),
  columnHelper.accessor('lastName', {
    sortUndefined: 'last',
    sortDescFirst: false,
  }),
  columnHelper.accessor('age', { sortFn: 'basic' }),
])

const table = constructTable({
  features,
  columns,
  data,
  initialState: { sorting: [] satisfies SortingState },
})

table.setSorting([{ id: 'age', desc: true }])
```

## Core Patterns

### Clickable header sorting with multi-sort on Shift+click

```tsx
// From examples/react/sorting/src/main.tsx
{
  headerGroup.headers.map((header) => (
    <th
      key={header.id}
      onClick={header.column.getToggleSortingHandler()}
      style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
    >
      <table.FlexRender header={header} />
      {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted() as string] ??
        null}
    </th>
  ))
}
```

`getToggleSortingHandler` already handles multi-sort when the user holds Shift (configurable via `isMultiSortEvent`).

### Custom `sortFn` for an enum

```ts
// From examples/react/sorting/src/main.tsx
const sortStatusFn: SortFn<typeof features, Person> = (
  rowA,
  rowB,
  _columnId,
) => {
  const statusOrder = ['single', 'complicated', 'relationship']
  return (
    statusOrder.indexOf(rowA.original.status) -
    statusOrder.indexOf(rowB.original.status)
  )
}

columnHelper.accessor('status', { sortFn: sortStatusFn })
```

Always return an ascending-order comparison. The row model multiplies by `-1` for descending and again for `invertSorting`.

### Direction control with `sortUndefined` and `invertSorting`

```ts
columnHelper.accessor('rank', {
  invertSorting: true, // rank 1 above rank 2 even when "descending"
})

columnHelper.accessor('lastName', {
  sortUndefined: 'last', // ABSOLUTE: end regardless of asc/desc
  sortDescFirst: false,
})
```

`sortUndefined` literals (`'first'`, `'last'`) are absolute. Numeric (`-1`, `1`) flips with `desc`.

### Server-side sorting

```tsx
const [sorting, setSorting] = useState<SortingState>([])
const { data } = useQuery({
  queryKey: ['rows', sorting],
  queryFn: () =>
    fetch('/api/rows?sort=' + serialize(sorting)).then((r) => r.json()),
})

const table = useTable({
  features: tableFeatures({ rowSortingFeature }),
  // omit sortedRowModel from features — server sorts
  columns,
  data,
  manualSorting: true,
  state: { sorting },
  onSortingChange: setSorting,
})
```

## Common Mistakes

### [HIGH] Using v8 `sortingFn` / `sortingFns` names

Wrong:

```tsx
{
  accessorKey: 'fullName',
  sortingFn: 'alphanumeric', // v8 name — falls through to sortFn_basic
}
// useTable({ sortingFns: { ...sortingFns, myFn } }) // v8 option name
```

Correct:

```tsx
import { sortFns, createSortedRowModel } from '@tanstack/react-table'

columnHelper.accessor('firstName', {
  sortFn: 'alphanumeric',
})

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    ...sortFns,
    myCustom: (a, b, id) => a.original[id] - b.original[id],
  },
})

const table = useTable({ features, columns, data })
```

v9 renamed `columnDef.sortingFn → sortFn`, the fn registry slot `sortingFns → sortFns` (now registered on `features`), exported registry `sortingFns → sortFns`. The new column option defaults to `'auto'` and falls back to `sortFn_basic` when lookup misses — wrong names sort wrong, silently.

Source: packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts

### [MEDIUM] Expecting `sortUndefined: 'first' | 'last'` to work in v8

Wrong:

```tsx
// agent assumes numeric and literal forms are interchangeable
{ accessorKey: 'lastName', sortUndefined: -1 } // ascending-first, descending-LAST
```

Correct:

```tsx
// From examples/react/sorting/src/main.tsx
columnHelper.accessor((row) => row.lastName, {
  id: 'lastName',
  sortUndefined: 'last', // ABSOLUTE: always at end regardless of asc/desc
  sortDescFirst: false,
})
```

v8 only had `false | -1 | 1`. v9 added `'first'` / `'last'`. Numeric flips with `desc`; literals are absolute.

Source: packages/table-core/src/features/row-sorting/createSortedRowModel.ts

### [MEDIUM] Custom `sortFn` factors `desc` in itself

Wrong:

```tsx
// takes sort direction into account, breaks the toggle
const customSort: SortFn<any, any> = (a, b, id, desc) => {
  // desc isn't even a parameter — agents try to detect via state
  const cmp = a.original[id] - b.original[id]
  return desc ? -cmp : cmp
}
```

Correct:

```tsx
// From examples/react/sorting/src/main.tsx
// Always return ascending; the row model handles desc & invertSorting.
const sortStatusFn: SortFn<any, any> = (rowA, rowB, _columnId) => {
  const statusOrder = ['single', 'complicated', 'relationship']
  return (
    statusOrder.indexOf(rowA.original.status) -
    statusOrder.indexOf(rowB.original.status)
  )
}
```

From the docs guide: "The comparison function does not need to take whether or not the column is in descending or ascending order into account. The row models will take care of that logic." Doubly-flipping yields broken toggles.

Source: packages/table-core/src/features/row-sorting/createSortedRowModel.ts

### [MEDIUM] Fuzzy filter without a fuzzy-aware `sortFn`

Wrong:

```ts
columnHelper.accessor('fullName', {
  filterFn: 'fuzzy',
  // BUG: rows sort alphabetically, not by match rank
})
```

Correct:

```ts
import { compareItems } from '@tanstack/match-sorter-utils'

const fuzzySort: SortFn<typeof features, Person> = (rowA, rowB, columnId) => {
  let dir = 0
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!,
    )
  }
  return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir
}

columnHelper.accessor('fullName', { filterFn: 'fuzzy', sortFn: fuzzySort })
```

The fuzzy filter writes `{ itemRank }` into `row.columnFiltersMeta[columnId]` via `addMeta`. Without a sortFn that reads it, results sort alphabetically and defeat the fuzzy ranking.

Source: examples/react/filters-fuzzy/src/main.tsx

### [MEDIUM] `getCanSort` returns false for display columns under `manualSorting`

Wrong:

```ts
// getCanSort() returns false even though manualSorting is true
const table = useTable({
  manualSorting: true,
  columns: [
    { id: 'computed', header: 'Computed', cell: (info) => row.x + row.y },
  ],
})
```

Correct:

```ts
columnHelper.display({
  id: 'computed',
  header: 'Computed',
  enableSorting: true, // force-enable for manualSorting
  cell: (info) => info.row.original.x + info.row.original.y,
})
```

`getCanSort` checks for `accessorKey`/`accessorFn` even under `manualSorting`. Force it on display columns via `enableSorting: true` (and let the server sort).

Source: https://github.com/TanStack/table/issues/4136

### [CRITICAL] Reimplementing what built-in APIs provide

Wrong:

```ts
const [sorting, setSorting] = useState([])
const sortedData = useMemo(
  () => [...data].sort(/* …custom… */),
  [data, sorting],
)
// then uses sortedData directly, bypassing the table
```

Correct:

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const table = useTable({ features, columns, data })
// table.setSorting(...), column.toggleSorting(), header.getToggleSortingHandler()
```

Source: maintainer interview (Phase 4, 2026-05-17)

## See also

- `tanstack-table/customizing-feature-behavior` — `sortFn` authoring + `addMeta` chain
- `tanstack-table/filtering` — fuzzy filter pattern that pairs with `fuzzySort`
- `tanstack-table/state-management` — `manualSorting` + server-side state ownership
