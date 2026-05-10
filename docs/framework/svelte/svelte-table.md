---
title: Svelte Table
---

> **IMPORTANT:** This version of `@tanstack/svelte-table` only supports Svelte 5 or newer. For Svelte 3/4 support, use version 8 of `@tanstack/svelte-table`.

The `@tanstack/svelte-table` adapter wraps `@tanstack/table-core` with Svelte 5 rune-based reactivity, rendering helpers, and types. It installs the Svelte `coreReativityFeature` for you, so table atoms can participate in Svelte dependency tracking.

TanStack Table v9 is explicit about what a table uses. Register features with `_features`, and register client-side row model factories with `_rowModels`. The core row model is included by default, so a basic table can use `_rowModels: {}`.

## Creating a Table

Use `createTable` to create a Svelte table instance.

```svelte
<script lang="ts">
  import {
    createTable,
    tableFeatures,
    type ColumnDef,
  } from '@tanstack/svelte-table'

  type Person = {
    firstName: string
    lastName: string
    age: number
  }

  const _features = tableFeatures({})

  const columns: Array<ColumnDef<typeof _features, Person>> = [
    {
      accessorKey: 'firstName',
      header: 'First name',
      cell: (info) => info.getValue(),
    },
  ]

  let data = $state<Person[]>([])

  const table = createTable({
    _features,
    _rowModels: {},
    columns,
    get data() {
      return data
    },
  })
</script>
```

For feature-specific row models, register the feature and put the row model factory under `_rowModels`.

```svelte
<script lang="ts">
  import {
    createPaginatedRowModel,
    createSortedRowModel,
    rowPaginationFeature,
    rowSortingFeature,
    sortFns,
    tableFeatures,
  } from '@tanstack/svelte-table'

  const _features = tableFeatures({
    rowPaginationFeature,
    rowSortingFeature,
  })

  const tableOptions = {
    _features,
    _rowModels: {
      paginatedRowModel: createPaginatedRowModel(),
      sortedRowModel: createSortedRowModel(sortFns),
    },
  }
</script>
```

## Table State

Table state is managed with TanStack Store atoms in v9. For most tables, you do not need to manage table state yourself: set `initialState` when you need starting values, and use feature APIs like `table.nextPage()`, `table.setSorting(...)`, and `row.toggleSelected()` instead of mutating state directly.

Use `atoms` when your app should own one state slice with TanStack Store. Use `state` with the matching `on[State]Change` option for simple Svelte state integration or migration paths. Selected table state is available on `table.state` when you pass a selector to `createTable`.

```svelte
<script lang="ts">
  import { createAtom } from '@tanstack/svelte-store'
  import {
    createTable,
    rowPaginationFeature,
    tableFeatures,
    type PaginationState,
  } from '@tanstack/svelte-table'

  const _features = tableFeatures({
    rowPaginationFeature,
  })

  const paginationAtom = createAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = createTable({
    _features,
    _rowModels: {},
    columns,
    get data() {
      return data
    },
    atoms: {
      pagination: paginationAtom,
    },
  })
</script>
```

See the [Table State Guide](./guide/table-state.md) for selectors, external atoms, and state ownership patterns.

## Rendering Headers, Cells, and Footers

Use `FlexRender` to render column `header`, `cell`, and `footer` definitions. It handles plain values, Svelte components wrapped with `renderComponent`, and snippets wrapped with `renderSnippet`.

```svelte
<script lang="ts">
  import {
    FlexRender,
    renderComponent,
    renderSnippet,
  } from '@tanstack/svelte-table'
</script>

<tbody>
  {#each table.getRowModel().rows as row (row.id)}
    <tr>
      {#each row.getVisibleCells() as cell (cell.id)}
        <td>
          <FlexRender cell={cell} />
        </td>
      {/each}
    </tr>
  {/each}
</tbody>
```

## createTableHook

`createTableHook` creates an app-specific table creator. Use it when multiple tables should share `_features`, `_rowModels`, default options, column helpers, and component conventions.

```ts
import { createTableHook, tableFeatures } from '@tanstack/svelte-table'

const { createAppTable, createAppColumnHelper } = createTableHook({
  _features: tableFeatures({}),
  _rowModels: {},
})

const columnHelper = createAppColumnHelper<Person>()

const table = createAppTable({
  columns,
  get data() {
    return data
  },
})
```

See the [Composable Tables example](./examples/composable-tables) for the full pattern.

## API Reference

See the [Svelte API Reference](./reference/index.md).
