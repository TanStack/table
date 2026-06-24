---
title: Composable Tables (createTableHook) Guide
---

`createTableHook` creates an app-specific table factory. Use it to define shared features, row models, and default table options once, then create each Svelte table with the columns and data that are unique to that table.

The same API can also register reusable table, cell, and header components, but component registration is optional. Start with shared options and features first; add reusable components only when your app needs standardized table UI pieces.

## Examples

- [Basic App Table](../examples/basic-app-table) - Minimal `createTableHook` setup.
- [Composable Tables](../examples/composable-tables) - Richer Users and Products tables sharing `src/hooks/table.ts` and reusable components.

## Start With Shared Features and Options

Create one app table hook and put the feature set, row models, and shared defaults there. This example makes sorting available to every table created by `createAppTable`.

```svelte
<script lang="ts">
  import {
    createSortedRowModel,
    createTableHook,
    rowSortingFeature,
    sortFns,
    tableFeatures,
  } from '@tanstack/svelte-table'

  const features = tableFeatures({
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns,
  })

  const { createAppTable, createAppColumnHelper } = createTableHook({
    features,
    debugTable: true,
    enableSortingRemoval: false,
  })
</script>
```

Options passed to `createTableHook` become defaults for every table created by `createAppTable`. The `features` option is also bound to the returned column helper, so column definitions know that sorting APIs are available.

## Create App Columns

Create one column helper per row type. The helper is already bound to your app's feature set, so each table does not need to thread `typeof features` through its column definitions.

```svelte
<script lang="ts">
  type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
  }

  const columnHelper = createAppColumnHelper<Person>()

  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      header: () => 'Last Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('age', {
      header: 'Age',
    }),
    columnHelper.accessor('visits', {
      header: 'Visits',
    }),
  ])
</script>
```

## Create A Table

Create each table with `createAppTable`. The call site provides table-specific inputs such as `columns` and reactive `data`; shared features and defaults come from the hook.

```svelte
<script lang="ts">
  let data = $state<Array<Person>>([])

  const table = createAppTable({
    key: 'users-table',
    columns,
    get data() {
      return data
    },
  })
</script>
```

## Render With The Normal Table APIs

You can render the table with the same table instance APIs used by a standalone `createTable` table. This simple path does not require `AppTable`, `AppCell`, `AppHeader`, or registered components.

```svelte
<table>
  <thead>
    {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
      <tr>
        {#each headerGroup.headers as header (header.id)}
          <th onclick={header.column.getToggleSortingHandler()}>
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

## Override Shared Defaults Per Table

Options passed to `createAppTable` override defaults from `createTableHook`. Use this for the few tables that need different behavior without creating a separate app hook.

```svelte
<script lang="ts">
  const table = createAppTable({
    key: 'sortable-users-table',
    columns,
    get data() {
      return data
    },
    enableSortingRemoval: true,
  })
</script>
```

## Optional: Reusable Components

The richer composable-tables example also uses `createTableHook` as a component registry. Use this when several tables should share the same toolbar controls, cell renderers, header renderers, or footer renderers.

### Component Registry Setup

The composable tables example keeps the shared configuration in `src/hooks/table.ts`.

```ts
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFns,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/svelte-table'

import PaginationControls from '../components/PaginationControls.svelte'
import RowCount from '../components/RowCount.svelte'
import TableToolbar from '../components/TableToolbar.svelte'
import CategoryCell from '../components/CategoryCell.svelte'
import NumberCell from '../components/NumberCell.svelte'
import PriceCell from '../components/PriceCell.svelte'
import ProgressCell from '../components/ProgressCell.svelte'
import RowActionsCell from '../components/RowActionsCell.svelte'
import StatusCell from '../components/StatusCell.svelte'
import TextCell from '../components/TextCell.svelte'
import ColumnFilter from '../components/ColumnFilter.svelte'
import FooterColumnId from '../components/FooterColumnId.svelte'
import FooterSum from '../components/FooterSum.svelte'
import SortIndicator from '../components/SortIndicator.svelte'

const features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
  filterFns,
})

export const {
  createAppColumnHelper,
  createAppTable,
  useTableContext,
  useCellContext,
  useHeaderContext,
} = createTableHook({
  features,
  getRowId: (row) => row.id,
  tableComponents: {
    PaginationControls,
    RowCount,
    TableToolbar,
  },
  cellComponents: {
    TextCell,
    NumberCell,
    StatusCell,
    ProgressCell,
    RowActionsCell,
    PriceCell,
    CategoryCell,
  },
  headerComponents: {
    SortIndicator,
    ColumnFilter,
    FooterColumnId,
    FooterSum,
  },
})
```

### Returned Helpers

| Helper | Purpose |
|---|---|
| `createAppTable` | Creates a Svelte table with shared features, row models, defaults, and registered components. |
| `createAppColumnHelper` | Creates column helpers with `TFeatures` and registered component types already bound. |
| `useTableContext` | Reads the current table inside registered table components. |
| `useCellContext` | Reads the current cell inside registered cell components. |
| `useHeaderContext` | Reads the current header/footer inside registered header components. |

### Component Columns

Create one column helper per row type. The Svelte example uses `renderComponent(...)` when a column def returns a registered Svelte component.

```svelte
<script lang="ts">
  import { renderComponent } from '@tanstack/svelte-table'
  import { createAppColumnHelper } from '../hooks/table'
  import type { Person } from '../makeData'

  const personColumnHelper = createAppColumnHelper<Person>()

  const columns = personColumnHelper.columns([
    personColumnHelper.accessor('firstName', {
      header: 'First Name',
      footer: (props) => props.column.id,
      cell: ({ cell }) => renderComponent(cell.TextCell),
    }),
    personColumnHelper.accessor('age', {
      header: 'Age',
      footer: (props) => props.column.id,
      cell: ({ cell }) => renderComponent(cell.NumberCell),
    }),
  ])
</script>
```

### Component Table Rendering

Create each table with `createAppTable`. In Svelte 5, pass reactive data through a getter so table options read the current rune value.

```svelte
<script lang="ts">
  let data = $state(makeData(1_000))

  const table = createAppTable({
    columns,
    get data() {
      return data
    },
    debugTable: true,
  })

  let sorting = $derived(table.state.sorting)
  let columnFilters = $derived(table.state.columnFilters)

  const rows = $derived.by(() => {
    JSON.stringify(table.state)
    return table.getRowModel().rows
  })
</script>
```

The returned table includes Svelte components for `AppTable`, `AppHeader`, `AppCell`, and `AppFooter`, plus the registered table components.

```svelte
<table.AppTable>
  <div class="table-container">
    <table.TableToolbar title="Users Table" onRefresh={refreshData} />

    <table>
      <thead>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <tr>
            {#each headerGroup.headers as h (h.id)}
              <table.AppHeader header={h}>
                {#snippet children(header)}
                  <th onclick={header.column.getToggleSortingHandler()}>
                    <header.FlexRender header={header} />
                    <header.SortIndicator />
                    <header.ColumnFilter />
                  </th>
                {/snippet}
              </table.AppHeader>
            {/each}
          </tr>
        {/each}
      </thead>
      <tbody>
        {#each rows as row (row.id)}
          <tr>
            {#each row.getAllCells() as cell (cell.id)}
              <table.AppCell cell={cell}>
                {#snippet children(appCell)}
                  <td>
                    <appCell.FlexRender cell={appCell} />
                  </td>
                {/snippet}
              </table.AppCell>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>

    <table.PaginationControls />
    <table.RowCount />
  </div>
</table.AppTable>
```

### Reusing The Component Registry

The Users and Products Svelte components import the same `createAppColumnHelper` and `createAppTable` from `src/hooks/table.ts`. Each component owns its `$state` data and columns, while the shared hook owns features, row models, row IDs, and the component registry.

## When To Use This Pattern

Use `createTableHook` when multiple tables should share features, row models, default options, or conventions. Use the standalone `createTable` API for a one-off table. Add the component registry only when the app wants standardized reusable table UI pieces.
