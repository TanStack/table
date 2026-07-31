---
title: Quick Start
---

TanStack Table is a headless table library. It manages your table's state and logic (sorting, filtering, pagination, selection, and more) while you keep 100% control over the markup and styles. This page gets you from install to a rendering Octane table, then shows how to layer on your first feature.

## Installation

TanStack Table v9 is currently published under the `beta` tag:

```bash
npm install @tanstack/octane-table@beta
```

## Your First Table

The component below is complete. Paste it into an Octane `.tsrx` file and you will see a working table. Octane components use a `@{ ... }` component body, and keyed `@for` blocks render dynamic lists.

```tsx
import { tableFeatures, useTable } from '@tanstack/octane-table'
import type { ColumnDef } from '@tanstack/octane-table'

// 1. Define the shape of your data
type Person = {
  firstName: string
  lastName: string
  age: number
}

// 2. Give your data a stable reference (module scope, useState, a query cache, etc.)
const data: Array<Person> = [
  { firstName: 'tanner', lastName: 'linsley', age: 24 },
  { firstName: 'tandy', lastName: 'miller', age: 40 },
  { firstName: 'joe', lastName: 'dirte', age: 45 },
]

// 3. New in v9: declare which features this table uses (none yet)
const features = tableFeatures({})

// 4. Define your columns
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName', // accessorKey shorthand
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName, // accessorFn alternative with a custom id
    id: 'lastName',
    header: () => <span>Last Name</span>,
    cell: (info) => <i>{info.getValue<string>()}</i>,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
  },
]

export function PersonTable() @{
  // 5. Create the table instance
  const table = useTable({
    features,
    columns,
    data,
  })

  // 6. Render markup from the table instance APIs
  <table>
    <thead>
      @for (const headerGroup of table.getHeaderGroups(); key headerGroup.id) {
        <tr>
          @for (const header of headerGroup.headers; key header.id) {
            <th>
              {header.isPlaceholder ? null : <table.FlexRender header={header} />}
            </th>
          }
        </tr>
      }
    </thead>
    <tbody>
      @for (const row of table.getRowModel().rows; key row.id) {
        <tr>
          @for (const cell of row.getAllCells(); key cell.id) {
            <td><table.FlexRender cell={cell} /></td>
          }
        </tr>
      }
    </tbody>
  </table>
}
```

A few things to note:

- `tableFeatures({})` declares which optional features the table uses. Registering only what you need keeps bundles small and gives TypeScript accurate types for the table instance.
- The core row model is always included automatically. Feature row models (sorting, filtering, pagination) are registered as slots directly on the `tableFeatures({...})` call when you need them.
- `table.FlexRender` renders the `header`, `cell`, and `footer` definitions from your columns, whether they are plain values or Octane components.
- Octane compiles your application and the Table adapter's authored TypeScript and TSRX for the current target and mode.

See the full [Basic useTable example](./examples/basic-use-table) for a runnable version with more columns and a footer.

## Add a Feature: Sorting

Features are opt-in in v9. To make columns sortable, register `rowSortingFeature` and the sorted row model in `tableFeatures`, then wire the header click handler.

```tsx
import {
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/octane-table'

const features = tableFeatures({
  rowSortingFeature, // enables sorting APIs and state
  sortedRowModel: createSortedRowModel(), // client-side sorting
  sortFns, // built-in sort functions
})

export function PersonTable() @{
  const table = useTable({
    features,
    columns,
    data,
  })

  <table>
    <thead>
      @for (const headerGroup of table.getHeaderGroups(); key headerGroup.id) {
        <tr>
          @for (const header of headerGroup.headers; key header.id) {
            <th>
              {header.isPlaceholder ? null : (
                <div
                  className={header.column.getCanSort() ? 'sortable-header' : ''}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <table.FlexRender header={header} />
                  {header.column.getIsSorted() === 'asc'
                    ? ' 🔼'
                    : header.column.getIsSorted() === 'desc'
                      ? ' 🔽'
                      : null}
                </div>
              )}
            </th>
          }
        </tr>
      }
    </thead>
    {/* tbody unchanged from above */}
  </table>
}
```

Clicking a header now toggles between ascending, descending, and unsorted. Every other feature follows this same pattern: register the feature and its row model factory in `tableFeatures`, then use the APIs those features add to the table, columns, and rows. See the [Sorting Guide](./guide/sorting.md) and the [Sorting example](./examples/sorting) for custom sort functions, multi-sorting, and per-column options.

## Where to Go Next

**Table state.** In v9, table state is backed by TanStack Store atoms. You usually do not need to manage it yourself: set `initialState` for starting values and call feature APIs like `table.setSorting(...)` or `table.nextPage()`. When your app should own a state slice, or you want fine-grained subscriptions, read the [Table State Guide](./guide/table-state.md). It is the foundational guide for everything else.

**Feature guides.** Each feature has its own guide, such as [Column Filtering](./guide/column-filtering.md), [Pagination](./guide/pagination.md), [Row Selection](./guide/row-selection.md), and [Column Visibility](./guide/column-visibility.md).

**Composable tables.** When multiple tables in your app share features, row models, and component conventions, define them once with `createTableHook`:

```tsx
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const { useAppTable, createAppColumnHelper } = createTableHook({ features })
```

See the [Composable Tables Guide](./guide/composable-tables.md) for the full pattern, including pre-bound cell and header components.

**Examples.** Browse the runnable [Octane examples](./examples/basic-use-table), from basic tables to feature demos, to see intended usage end to end.
