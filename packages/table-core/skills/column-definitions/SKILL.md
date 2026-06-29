---
name: column-definitions
description: >
  Define TanStack Table v9 columns with `createColumnHelper<typeof features, TData>()`.
  Covers `columnHelper.accessor` (key + function forms), `columnHelper.display`,
  `columnHelper.group`, `columnHelper.columns`, the `ColumnDef`/`AccessorKeyColumnDef`/
  `AccessorFnColumnDef`/`DisplayColumnDef`/`GroupColumnDef` types, `accessorKey` with
  `DeepKeys`, `accessorFn`, the `header`/`cell`/`footer`/`aggregatedCell` renderers,
  required `id` rules, and `getRowId` for stable row identity.
type: core
library: tanstack-table
library_version: '9.0.0-alpha.48'
sources:
  - TanStack/table:docs/guide/column-defs.md
  - TanStack/table:docs/guide/columns.md
  - TanStack/table:packages/table-core/src/helpers/columnHelper.ts
  - TanStack/table:packages/table-core/src/core/columns/constructColumn.ts
  - TanStack/table:examples/react/basic-use-table/src/main.tsx
---

## Setup

`createColumnHelper` takes TWO generics in v9: the features type (so accessor keys, sort/filter strings, etc. are typed against your registered features) and the row data type.

```ts
import {
  createColumnHelper,
  tableFeatures,
  rowSortingFeature,
} from '@tanstack/table-core'

type Person = {
  id: string
  firstName: string
  lastName: string
  age: number
  visits: number
}

const features = tableFeatures({ rowSortingFeature })

// TFeatures FIRST, TData SECOND
const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  // accessorKey — deep keys via DeepKeys (dot paths) are supported
  columnHelper.accessor('firstName', { header: 'First Name' }),
  columnHelper.accessor('lastName', { header: 'Last Name' }),
  columnHelper.accessor('age', { header: 'Age' }),

  // accessorFn — needs an explicit `id`
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: 'fullName',
    header: 'Full Name',
    cell: (info) => info.getValue(),
  }),

  // display column — no value extraction, just rendering
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => `Edit ${row.original.id}`,
  }),

  // group column — wraps child columns under a shared header
  columnHelper.group({
    id: 'stats',
    header: 'Stats',
    columns: [columnHelper.accessor('visits', { header: 'Visits' })],
  }),
])
```

## Core Patterns

### Stable row identity with `getRowId`

```ts
const table = useTable({
  features,
  columns,
  data,
  getRowId: (row) => row.id, // ← stable from row's own data
})
```

Without `getRowId`, `row.id` defaults to the row's array index. Row-keyed state (selection, expansion, pinning) then attaches to whatever happens to be at that index after a sort/filter/refetch.

### Accessor key with deep path

```ts
type User = { name: { first: string; last: string } }

const columnHelper = createColumnHelper<typeof features, User>()

columnHelper.accessor('name.first', { header: 'First' })
columnHelper.accessor('name.last', { header: 'Last' })
```

For nested objects with non-optional intermediate keys, the dotted `accessorKey` form works and infers the right value type. Switch to `accessorFn` when intermediates are optional (see Common Mistakes below).

### Header / cell / footer renderers

```ts
columnHelper.accessor('age', {
  header: () => 'Age',
  cell: (info) => info.getValue(),
  footer: (info) => `${info.table.getRowModel().rows.length} rows`,
})
```

Renderers accept string, JSX (in framework adapters), or function forms. Render via `flexRender(def, ctx)` or `<table.FlexRender header={header} />` so all three forms work uniformly.

### `columnHelper.columns([...])` for module-scope stability

```ts
// Outside any component / hook — stable reference forever
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First' }),
  columnHelper.accessor('lastName', { header: 'Last' }),
])
```

`columnHelper.columns` returns the array as-is but preserves the precise tuple types. Hoist to module scope or wrap in `useMemo` — the table compares `columns` by reference.

## Common Mistakes

### [CRITICAL] Passing only `TData` to `createColumnHelper`

Wrong:

```ts
// v8 signature — TData ends up in the TFeatures slot
const columnHelper = createColumnHelper<Person>()
```

Correct:

```ts
const features = tableFeatures({ rowSortingFeature })
const columnHelper = createColumnHelper<typeof features, Person>()
```

v9 changed the generic order: `<TFeatures, TData>`. The compiler error is noisy because `Person` lands in the `TFeatures` slot and breaks every column type that follows.

Source: packages/table-core/src/helpers/columnHelper.ts; docs/framework/react/guide/migrating.md

### [HIGH] Accessor function returns an object or array

Wrong:

```ts
// returns an object — built-in alphanumeric sort and includesString filter break
columnHelper.accessor((row) => row.name, {
  id: 'name',
  cell: (info) => `${info.getValue().first} ${info.getValue().last}`,
})
```

Correct:

```ts
// accessor returns a primitive; cell can still format it
columnHelper.accessor((row) => `${row.name.first} ${row.name.last}`, {
  id: 'fullName',
  cell: (info) => info.getValue(),
})
```

The accessed value drives sorting, filtering, faceting, and grouping. Built-in `sortFn`/`filterFn`/`aggregationFn` expect a primitive `string` / `number` / `Date`. Return a primitive — or supply a matching custom function.

Source: docs/guide/column-defs.md

### [CRITICAL] Omitting `id` on an `accessorFn` column

Wrong:

```tsx
// accessorFn + JSX header => no id can be derived
columnHelper.accessor((row) => row.lastName, {
  header: () => <span>Last Name</span>,
  cell: (info) => info.getValue(),
})
```

Correct:

```tsx
columnHelper.accessor((row) => row.lastName, {
  id: 'lastName', // required when there's no string accessorKey or string header
  header: () => <span>Last Name</span>,
  cell: (info) => info.getValue(),
})
```

The constructor throws "coreColumnsFeature require an id when using an accessorFn" in development. The same applies to non-string `header` values without a fallback `id`.

Source: packages/table-core/src/core/columns/constructColumn.ts

### [CRITICAL] Defining `columns` inside the component without `useMemo`

Wrong:

```tsx
function MyTable() {
  // new array reference every render → infinite render loop
  const columns = [
    columnHelper.accessor('firstName', { header: 'First' }),
    columnHelper.accessor('lastName', { header: 'Last' }),
  ]
  const table = useTable({ features, columns, data })
}
```

Correct:

```tsx
function MyTable() {
  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('firstName', { header: 'First' }),
        columnHelper.accessor('lastName', { header: 'Last' }),
      ]),
    [],
  )
  const table = useTable({ features, columns, data })
}
```

TanStack Table compares `columns` and `data` by reference. The #1 FAQ entry across versions.

Source: docs/faq.md; examples/react/basic-subscribe/src/main.tsx

### [HIGH] Using array-index row IDs with mutating data

Wrong:

```ts
// no getRowId — rowSelection survives data updates but maps to wrong rows
const table = useTable({
  features,
  columns,
  data,
  enableRowSelection: true,
})
```

Correct:

```ts
const table = useTable({
  features,
  columns,
  data,
  getRowId: (row) => row.id,
  enableRowSelection: true,
})
```

When `data` reorders, filters, or items are removed/refetched, row-keyed state (selection, expansion, pinning) attaches to the wrong row.

Source: docs/guide/rows.md; packages/table-core/src/core/rows/coreRowsFeature.utils.ts

### [MEDIUM] `accessorKey` with optional path strips `undefined` from `getValue` type

Wrong:

```ts
// amount inferred as `number` even though salary is optional
columnHelper.accessor('user.salary.amount', {
  cell: (info) => {
    const amount = info.getValue() // type: number (WRONG)
    return amount.toFixed(2) // crashes when salary is undefined
  },
})
```

Correct:

```ts
columnHelper.accessor((row) => row.user.salary?.amount, {
  id: 'salary',
  cell: (info) => {
    const amount = info.getValue() // type: number | undefined
    return amount?.toFixed(2) ?? '-'
  },
})
```

The `DeepValue` type doesn't propagate `undefined` through optional intermediates. Use `accessorFn` when any segment is optional — the type follows the expression.

Source: https://github.com/TanStack/table/issues/6238

### [MEDIUM] `columnHelper.accessor` nested inside `columnHelper.group` loses `getValue` inference

Wrong:

```ts
// info.getValue() inferred as unknown
columnHelper.group({
  id: 'name',
  columns: [
    columnHelper.accessor('firstName', {
      cell: (info) => info.getValue(), // unknown
    }),
  ],
})
```

Correct:

```ts
// Hoist accessor definitions out of the group
const firstNameCol = columnHelper.accessor('firstName', {
  cell: (info) => info.getValue(), // string
})

columnHelper.group({ id: 'name', columns: [firstNameCol] })
```

The group helper's overloads don't thread `TData` through correctly when accessors are defined inline.

Source: https://github.com/TanStack/table/issues/5860

## See also

- `tanstack-table/setup` — how `features` (with row model factory slots) threads through `useTable`
- `tanstack-table/customizing-feature-behavior` — per-column `sortFn`/`filterFn`/`aggregationFn`
- `tanstack-table/row-selection` — why `getRowId` is essentially mandatory
