---
title: Using useLegacyTable for Incremental Migration
---

The `useLegacyTable` hook provides a compatibility layer that accepts the v8-style API while using v9 under the hood. This is useful for teams that need to migrate incrementally or have large codebases where a full migration isn't immediately practical.

> **Warning:** `useLegacyTable` is **deprecated** and intended only as a temporary migration aid. It includes all features by default, resulting in a larger bundle size compared to the tree-shakeable v9 API. Plan to migrate to `useTable` for better performance and smaller bundles.

## When to Use `useLegacyTable`

- You have an existing v8 codebase and need to upgrade dependencies
- You want to migrate incrementally, one table at a time
- You need v9 compatibility but don't have time for a full migration yet

## Basic Usage

```tsx
import { useState } from 'react'
import { flexRender } from '@tanstack/react-table'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  legacyCreateColumnHelper,
  useLegacyTable,
} from '@tanstack/react-table/legacy'
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import type {
  LegacyColumn,
  LegacyColumnDef,
  LegacyRow,
} from '@tanstack/react-table/legacy'

interface Person {
  name: string
  email: string
  age: number
}

const columnHelper = legacyCreateColumnHelper<Person>()

const columns: LegacyColumnDef<Person>[] = [
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('age', { header: 'Age' }),
  columnHelper.display({ id: 'actions', header: 'Actions' }),
]

function MyTable({ data }: { data: Person[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // useLegacyTable accepts the v8-style API
  const table = useLegacyTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, columnFilters, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
  })

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                {header.column.getCanFilter() ? (
                  <Filter column={header.column} />
                ) : null}
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
                {cell.column.id === 'actions' ? (
                  <RowActions row={row} />
                ) : (
                  flexRender(cell.column.columnDef.cell, cell.getContext())
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Filter({ column }: { column: LegacyColumn<Person> }) {
  return (
    <input
      value={(column.getFilterValue() as string) ?? ''}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder="Filter..."
    />
  )
}

function RowActions({ row }: { row: LegacyRow<Person> }) {
  return <button onClick={() => console.log(row.original)}>Edit</button>
}
```

## Type Helpers

When using `useLegacyTable`, use these type helpers for proper TypeScript support:

| Type | Description |
|------|-------------|
| `LegacyColumnDef<TData>` | Column definition type (equivalent to v8's `ColumnDef<TData>`) |
| `LegacyColumn<TData>` | Column instance type |
| `LegacyRow<TData>` | Row instance type |
| `LegacyCell<TData>` | Cell instance type |
| `LegacyTable<TData>` | Table instance type |
| `legacyCreateColumnHelper<TData>()` | Column helper with StockFeatures pre-bound—only requires TData |

### Using `legacyCreateColumnHelper`

Use `legacyCreateColumnHelper` instead of `createColumnHelper`—it has StockFeatures pre-bound, so you only need to specify `TData`:

```tsx
import { legacyCreateColumnHelper } from '@tanstack/react-table/legacy'
import type { LegacyColumnDef } from '@tanstack/react-table/legacy'

const columnHelper = legacyCreateColumnHelper<Person>()

const columns: LegacyColumnDef<Person>[] = [
  columnHelper.accessor('name', { header: 'Name' }),
  // ...
]
```

## API Differences from v8

While `useLegacyTable` aims for v8 compatibility, there are a few differences:

### Row Model Functions

The `get*RowModel()` functions are imported from `@tanstack/react-table/legacy`:

```tsx
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
} from '@tanstack/react-table/legacy'
```

### Sorting Function Renames

Note that in v9, sorting-related APIs have been renamed. If you're using custom sorting functions in column definitions:

| v8 | v9 |
|----|-----|
| `sortingFn` | `sortFn` |

The legacy table adapter handles this internally for built-in sorting, but if you're defining custom sorting functions, be aware of the rename.

## Caveats and Limitations

### Bundle Size

`useLegacyTable` includes **all features** by default, similar to v8. This means:

- No tree-shaking benefits
- Bundle size is **much larger** than v8—each feature has grown since v8, and you pay for all of them
- The tree-shakeable v9 API exists so TanStack Table can add features over time without bloating everyone's bundles; only users who opt into a feature pay for it
- If bundle size is a concern, prioritize migrating to the full v9 API

### Deprecation

`useLegacyTable` is deprecated and will be removed in a future major version. It exists solely to ease migration. Plan your migration timeline accordingly.

### No `table.Subscribe`

The fine-grained reactivity feature (`table.Subscribe`) is not available with `useLegacyTable`. The table re-renders on every state change, like v8.

### No `createTableHook` Integration

`useLegacyTable` cannot be used with `createTableHook`. If you want to create reusable table configurations, migrate to the full v9 API.

## Migration Path

Once you're ready to migrate to the full v9 API:

1. Replace `useLegacyTable` with `useTable`
2. Define your `_features` using `tableFeatures()`
3. Convert `get*RowModel()` options to `_rowModels`
4. Update types from `Legacy*` to the standard v9 types

See the [main migration guide](./migrating.md) for complete instructions.

## Example

See the [Basic useLegacyTable example](../examples/basic-use-legacy-table) for a working implementation.
