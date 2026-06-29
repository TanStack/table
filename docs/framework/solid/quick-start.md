---
title: Quick Start
---

TanStack Table is a headless table library. It manages your table's state and logic (sorting, filtering, pagination, selection, and more) while you keep 100% control over the markup and styles. This page gets you from install to a rendering Solid table, then shows how to layer on your first feature.

## Installation

TanStack Table v9 is currently published under the `beta` tag:

```bash
npm install @tanstack/solid-table@beta
```

## Your First Table

The component below is complete. Paste it into a Solid app and you will see a working table.

```tsx
import { FlexRender, createTable, tableFeatures } from '@tanstack/solid-table'
import { For, createSignal } from 'solid-js'
import type { ColumnDef } from '@tanstack/solid-table'

// 1. Define the shape of your data
type Person = {
  firstName: string
  lastName: string
  age: number
}

const defaultData: Array<Person> = [
  { firstName: 'tanner', lastName: 'linsley', age: 24 },
  { firstName: 'tandy', lastName: 'miller', age: 40 },
  { firstName: 'joe', lastName: 'dirte', age: 45 },
]

// 2. New in v9: declare which features this table uses (none yet)
const features = tableFeatures({})

// 3. Define your columns
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

export function PersonTable() {
  // 4. Store your data in a signal (this could also be a resource or query)
  const [data] = createSignal(defaultData)

  // 5. Create the table instance, passing data through a getter so it stays reactive
  const table = createTable({
    key: 'person-table', // registers this table with the devtools
    features,
    columns,
    get data() {
      return data()
    },
  })

  // 6. Render markup from the table instance APIs
  return (
    <table>
      <thead>
        <For each={table.getHeaderGroups()}>
          {(headerGroup) => (
            <tr>
              <For each={headerGroup.headers}>
                {(header) => (
                  <th>
                    {header.isPlaceholder ? null : (
                      <FlexRender header={header} />
                    )}
                  </th>
                )}
              </For>
            </tr>
          )}
        </For>
      </thead>
      <tbody>
        <For each={table.getRowModel().rows}>
          {(row) => (
            <tr>
              <For each={row.getAllCells()}>
                {(cell) => (
                  <td>
                    <FlexRender cell={cell} />
                  </td>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  )
}
```

A few things to note:

- `tableFeatures({})` declares which optional features the table uses. Registering only what you need keeps bundles small and gives TypeScript accurate types for the table instance.
- The `get data()` getter keeps the table reactive: when the signal updates, the table sees the new data. Passing `data: data()` would capture a one-time snapshot.
- `FlexRender` renders the `header`, `cell`, and `footer` definitions from your columns, whether they are plain values or Solid components. It is also available on the table instance as `table.FlexRender`.
- The `key` option is optional unless you use the [TanStack Table Devtools](../../devtools). The devtools identify tables by `key`, and you register a table by calling `useTanStackTableDevtools(table)` from `@tanstack/solid-table-devtools`.

See the full [Basic createTable example](./examples/basic-use-table) for a runnable version with more columns and a footer.

## Add a Feature: Sorting

Features are opt-in in v9. To make columns sortable, register `rowSortingFeature` and the sorted row model factory in `tableFeatures`, then wire the header click handler.

```tsx
import {
  FlexRender,
  createSortedRowModel,
  createTable,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, Show, createSignal } from 'solid-js'

const features = tableFeatures({
  rowSortingFeature, // enables sorting APIs and state
  sortedRowModel: createSortedRowModel(), // client-side sorting
  sortFns,
})

export function PersonTable() {
  const [data] = createSignal(defaultData)

  const table = createTable({
    key: 'person-table',
    features,
    columns,
    get data() {
      return data()
    },
  })

  return (
    <table>
      <thead>
        <For each={table.getHeaderGroups()}>
          {(headerGroup) => (
            <tr>
              <For each={headerGroup.headers}>
                {(header) => (
                  <th>
                    <Show when={!header.isPlaceholder}>
                      <div
                        style={{
                          cursor: header.column.getCanSort()
                            ? 'pointer'
                            : undefined,
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <FlexRender header={header} />
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </Show>
                  </th>
                )}
              </For>
            </tr>
          )}
        </For>
      </thead>
      {/* tbody unchanged from above */}
    </table>
  )
}
```

Clicking a header now toggles between ascending, descending, and unsorted. Every other feature follows this same pattern: register the feature and its row model factory (if it has one) in `tableFeatures`, then use the APIs it adds to the table, columns, and rows. See the [Sorting Guide](./guide/sorting.md) and the [Sorting example](./examples/sorting) for custom sort functions, multi-sorting, and per-column options.

## Where to Go Next

**Table state.** In v9, table state is backed by TanStack Store atoms that plug directly into Solid's fine-grained reactivity. You usually do not need to manage it yourself: set `initialState` for starting values and call feature APIs like `table.setSorting(...)` or `table.nextPage()`. When your app should own a state slice, or you want fine-grained subscriptions, read the [Table State Guide](./guide/table-state.md). It is the foundational guide for everything else.

**Feature guides.** Each feature has its own guide, such as [Column Filtering](./guide/column-filtering.md), [Pagination](./guide/pagination.md), [Row Selection](./guide/row-selection.md), and [Column Visibility](./guide/column-visibility.md).

**Composable tables.** When multiple tables in your app share features, row models, and component conventions, define them once with `createTableHook`:

```tsx
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const { createAppTable, createAppColumnHelper } = createTableHook({ features })
```

See the [Composable Tables Guide](./guide/composable-tables.md) for the full pattern, including pre-bound cell and header components.

**Examples.** Browse the runnable [Solid examples](./examples/basic-use-table), from basic tables to feature demos, to see intended usage end to end.
