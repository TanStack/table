---
title: Composable Tables Guide
---

Composable tables are app-level table factories built with `createTableHook`. They let Svelte apps define shared features, row models, default options, and reusable Svelte components once, then create multiple tables from that setup.

Use this pattern when several tables should share behavior and rendering conventions. For one standalone table, `createTable` is usually enough.

## Examples

- [Composable Tables](../examples/composable-tables) - Users and Products tables sharing `src/hooks/table.ts`.
- [Basic App Table](../examples/basic-app-table) - Minimal `createTableHook` setup.

## Setup

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

## Returned Helpers

| Helper | Purpose |
|---|---|
| `createAppTable` | Creates a Svelte table with shared features, row models, defaults, and registered components. |
| `createAppColumnHelper` | Creates column helpers with `TFeatures` and registered component types already bound. |
| `useTableContext` | Reads the current table inside registered table components. |
| `useCellContext` | Reads the current cell inside registered cell components. |
| `useHeaderContext` | Reads the current header/footer inside registered header components. |

## Columns

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

## Table Rendering

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

## Reusing The Hook

The Users and Products Svelte components import the same `createAppColumnHelper` and `createAppTable` from `src/hooks/table.ts`. Each component owns its `$state` data and columns, while the shared hook owns features, row models, row IDs, and the component registry.
