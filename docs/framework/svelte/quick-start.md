---
title: Quick Start
---

TanStack Table is a headless table library. It manages your table's state and logic (sorting, filtering, pagination, selection, and more) while you keep 100% control over the markup and styles. This page gets you from install to a rendering Svelte table, then shows how to layer on your first feature.

> **IMPORTANT:** This version of `@tanstack/svelte-table` only supports Svelte 5 or newer. For Svelte 3/4 support, use version 8 of `@tanstack/svelte-table`.

## Installation

TanStack Table v9 is currently published under the `beta` tag:

```bash
npm install @tanstack/svelte-table@beta
```

## Your First Table

The component below is complete. Paste it into a Svelte 5 app and you will see a working table.

```svelte
<script lang="ts">
  import { createTable, FlexRender, tableFeatures } from '@tanstack/svelte-table'
  import type { ColumnDef } from '@tanstack/svelte-table'

  // 1. Define the shape of your data
  type Person = {
    firstName: string
    lastName: string
    age: number
  }

  // 2. Store data with a $state rune for reactivity
  let data = $state<Array<Person>>([
    { firstName: 'tanner', lastName: 'linsley', age: 24 },
    { firstName: 'tandy', lastName: 'miller', age: 40 },
    { firstName: 'joe', lastName: 'dirte', age: 45 },
  ])

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
      header: () => 'Last Name',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'age',
      header: () => 'Age',
    },
  ]

  // 5. Create the table instance
  const table = createTable({
    features,
    columns,
    get data() {
      return data // a getter keeps the table in sync with the $state rune
    },
  })
</script>

<!-- 6. Render markup from the table instance APIs -->
<table>
  <thead>
    {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
      <tr>
        {#each headerGroup.headers as header (header.id)}
          <th>
            {#if !header.isPlaceholder}
              <FlexRender header={header} />
            {/if}
          </th>
        {/each}
      </tr>
    {/each}
  </thead>
  <tbody>
    {#each table.getRowModel().rows as row (row.id)}
      <tr>
        {#each row.getAllCells() as cell (cell.id)}
          <td>
            <FlexRender cell={cell} />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
```

A few things to note:

- `tableFeatures({})` declares which optional features the table uses. Registering only what you need keeps bundles small and gives TypeScript accurate types for the table instance.
- The core row model is always included automatically. Feature row models (sorting, filtering, pagination) are registered as slots directly on `tableFeatures({...})` when you need them.
- Passing `data` through a getter (`get data() { return data }`) lets the table track the `$state` rune, so reassigning `data` updates the table.
- The `FlexRender` component renders the `header`, `cell`, and `footer` definitions from your columns. It handles plain values, Svelte components wrapped with `renderComponent`, and snippets wrapped with `renderSnippet` (see the [Basic Snippets example](./examples/basic-snippets)).

See the full [Basic createTable example](./examples/basic-create-table) for a runnable version with more columns and a footer.

## Add a Feature: Sorting

Features are opt-in in v9. To make columns sortable, register `rowSortingFeature` and `sortedRowModel` in `tableFeatures`, and wire a click handler into the header markup.

```svelte
<script lang="ts">
  import {
    createSortedRowModel,
    createTable,
    FlexRender,
    rowSortingFeature,
    sortFns,
    tableFeatures,
  } from '@tanstack/svelte-table'

  const features = tableFeatures({
    rowSortingFeature, // enables sorting APIs and state
    sortedRowModel: createSortedRowModel(), // client-side sorting
    sortFns,
  })

  const table = createTable(
    {
      features,
      columns,
      get data() {
        return data
      },
    },
    // an optional second argument selects which state to track; it defaults
    // to the full registered state, so it is omitted here
  )
</script>

<table>
  <thead>
    {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
      <tr>
        {#each headerGroup.headers as header (header.id)}
          <th>
            {#if !header.isPlaceholder}
              <button
                disabled={!header.column.getCanSort()}
                onclick={header.column.getToggleSortingHandler()}
              >
                <FlexRender header={header} />
                {#if header.column.getIsSorted() === 'asc'}
                  🔼
                {:else if header.column.getIsSorted() === 'desc'}
                  🔽
                {/if}
              </button>
            {/if}
          </th>
        {/each}
      </tr>
    {/each}
  </thead>
  <!-- tbody unchanged from above -->
</table>
```

Clicking a header now toggles between ascending, descending, and unsorted. Every other feature follows this same pattern: register the feature and its row model together in `tableFeatures({...})`, then use the APIs it adds to the table, columns, and rows. See the [Sorting Guide](./guide/sorting.md) and the [Sorting example](./examples/sorting) for custom sort functions, multi-sorting, and per-column options.

## Where to Go Next

**Table state.** In v9, table state is backed by TanStack Store atoms, and the Svelte adapter installs rune-based reactivity for you. You usually do not need to manage state yourself: set `initialState` for starting values and call feature APIs like `table.setSorting(...)` or `table.nextPage()`. When your app should own a state slice, or you want fine-grained subscriptions, read the [Table State Guide](./guide/table-state.md). It is the foundational guide for everything else.

**Feature guides.** Each feature has its own guide, such as [Column Filtering](./guide/column-filtering.md), [Pagination](./guide/pagination.md), [Row Selection](./guide/row-selection.md), and [Column Visibility](./guide/column-visibility.md).

**Composable tables.** When multiple tables in your app share features, row models, and component conventions, define them once with `createTableHook`:

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const { createAppTable, createAppColumnHelper } = createTableHook({ features })
```

See the [Composable Tables Guide](./guide/composable-tables.md) for the full pattern, including pre-bound cell and header components.

**Examples.** Browse the runnable [Svelte examples](./examples/basic-create-table), from basic tables to feature demos, to see intended usage end to end.
