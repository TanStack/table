---
title: Composable Tables Guide
---

Composable tables are app-level table factories built with `createTableHook`. They let Vue apps define shared features, row models, default options, and reusable components once, then create multiple tables from that setup.

Use this pattern when several tables should share behavior and rendering conventions. For one standalone table, `useTable` is usually enough.

## Examples

- [Composable Tables](../examples/composable-tables) - Users and Products tables sharing `src/hooks/table.ts`.
- [Basic useAppTable](../examples/basic-use-app-table) - Minimal `createTableHook` setup.

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
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/vue-table'

import {
  CategoryCell,
  NumberCell,
  PriceCell,
  ProgressCell,
  RowActionsCell,
  StatusCell,
  TextCell,
} from '../components/cell-components'
import {
  ColumnFilter,
  FooterColumnId,
  FooterSum,
  SortIndicator,
} from '../components/header-components'
import {
  PaginationControls,
  RowCount,
  TableToolbar,
} from '../components/table-components'
import type {
  Cell,
  CellData,
  Header,
  RowData,
  VueTable,
} from '@tanstack/vue-table'

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns,
  sortFns,
})

const _hook = createTableHook({
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

export const createAppColumnHelper = _hook.createAppColumnHelper
export const useAppTable = _hook.useAppTable
```

The example also exports explicit type annotations for `useTableContext`, `useCellContext`, and `useHeaderContext`. Those annotations break the circular inference chain caused by component files importing context helpers from this file while this file imports those components.

```ts
export const useTableContext: <TData extends RowData = RowData>() => VueTable<
  typeof features,
  TData
> = _hook.useTableContext

export const useCellContext: <TValue extends CellData = CellData>() => Cell<
  typeof features,
  any,
  TValue
> = _hook.useCellContext

export const useHeaderContext: <TValue extends CellData = CellData>() => Header<
  typeof features,
  any,
  TValue
> = _hook.useHeaderContext
```

## Returned Helpers

| Helper | Purpose |
|---|---|
| `useAppTable` | Creates a Vue table with shared features, row models, defaults, and registered components. |
| `createAppColumnHelper` | Creates column helpers with `TFeatures` and registered component types already bound. |
| `useTableContext` | Reads the current table inside registered table components. |
| `useCellContext` | Reads the current cell inside registered cell components. |
| `useHeaderContext` | Reads the current header/footer inside registered header components. |

## Columns

Create one column helper per row type. Vue registered components are returned from column definitions and then rendered through dynamic `<component>` usage.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { createAppColumnHelper, useAppTable } from '../hooks/table'
import { makeData } from '../makeData'
import type { Person } from '../makeData'

const columnHelper = createAppColumnHelper<Person>()
const data = ref(makeData(1_000))

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.TextCell,
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    footer: (props) => props.column.id,
    cell: ({ cell }) => cell.NumberCell,
  }),
])
</script>
```

## Table Rendering

Create each table with `useAppTable`. Pass table-specific options like `key`, `columns`, reactive `data`, and any per-table state.

```ts
const table = useAppTable({
  key: 'users-table',
  debugTable: true,
  columns,
  data,
  initialState: {
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  },
})
```

The returned table includes Vue components for `AppTable`, `AppHeader`, `AppCell`, and `AppFooter`. The example renders them with dynamic components and slot props.

```vue
<template>
  <component :is="table.AppTable" :selector="tableSelector" v-slot="{ state }">
    <section class="table-container">
      <component :is="table.TableToolbar" title="Users Table" />

      <table>
        <thead>
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <component
              :is="table.AppHeader"
              v-for="header in headerGroup.headers"
              :key="header.id"
              :header="header"
              v-slot="{ header: appHeader }"
            >
              <th @click="appHeader.column.getToggleSortingHandler()?.($event)">
                <component :is="appHeader.FlexRender" />
                <component :is="appHeader.SortIndicator" />
                <component :is="appHeader.ColumnFilter" />
              </th>
            </component>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.id">
            <component
              :is="table.AppCell"
              v-for="cell in row.getAllCells()"
              :key="cell.id"
              :cell="cell"
              v-slot="{ cell: appCell }"
            >
              <td>
                <component :is="appCell.FlexRender" />
              </td>
            </component>
          </tr>
        </tbody>
      </table>

      <component :is="table.PaginationControls" />
      <component :is="table.RowCount" />
    </section>
  </component>
</template>
```

## Reusing The Hook

The Users and Products Vue components import the same `createAppColumnHelper` and `useAppTable` from `src/hooks/table.ts`. Each component owns its refs and columns, while the shared hook owns features, row models, row IDs, table components, cell components, and header/footer components.
