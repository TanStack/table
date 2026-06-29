---
title: Composable Tables (createTableHook) Guide
---

`createTableHook` creates an app-specific table factory. Use it to define shared features, row models, and default table options once, then create each Vue table with the columns and data that are unique to that table.

The same API can also register reusable table, cell, and header components, but component registration is optional. Start with shared options and features first; add reusable components only when your app needs standardized table UI pieces.

## Examples

- [Basic useAppTable](../examples/basic-use-app-table) - Minimal `createTableHook` setup.
- [Composable Tables](../examples/composable-tables) - Richer Users and Products tables sharing `src/hooks/table.ts` and reusable components.

## Start With Shared Features and Options

Create one app table hook and put the feature set, row models, and shared defaults there. This example makes sorting available to every table created by `useAppTable`.

```ts
import {
  createSortedRowModel,
  createTableHook,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/vue-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const { useAppTable, createAppColumnHelper } = createTableHook({
  features,
  debugTable: true,
  enableSortingRemoval: false,
})
```

Options passed to `createTableHook` become defaults for every table created by `useAppTable`. The `features` option is also bound to the returned column helper, so column definitions know that sorting APIs are available.

## Create App Columns

Create one column helper per row type. The helper is already bound to your app's feature set, so each table does not need to thread `typeof features` through its column definitions.

```ts
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
    header: 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', {
    header: 'Age',
  }),
  columnHelper.accessor('visits', {
    header: 'Visits',
  }),
])
```

## Create A Table

Create each table with `useAppTable`. The call site provides table-specific inputs such as `columns` and reactive `data`; shared features and defaults come from the hook.

```ts
const data = ref<Array<Person>>([])

const table = useAppTable({
  key: 'users-table',
  columns,
  data,
})
```

## Render With The Normal Table APIs

You can render the table with the same table instance APIs used by a standalone `useTable` table. This simple path does not require `AppTable`, `AppCell`, `AppHeader`, or registered components.

```vue
<template>
  <table>
    <thead>
      <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
        <th
          v-for="header in headerGroup.headers"
          :key="header.id"
          @click="header.column.getToggleSortingHandler()?.($event)"
        >
          <FlexRender v-if="!header.isPlaceholder" :header="header" />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in table.getRowModel().rows" :key="row.id">
        <td v-for="cell in row.getAllCells()" :key="cell.id">
          <FlexRender :cell="cell" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
```

## Override Shared Defaults Per Table

Options passed to `useAppTable` override defaults from `createTableHook`. Use this for the few tables that need different behavior without creating a separate app hook.

```ts
const table = useAppTable({
  key: 'sortable-users-table',
  columns,
  data,
  enableSortingRemoval: true,
})
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

### Returned Helpers

| Helper | Purpose |
|---|---|
| `useAppTable` | Creates a Vue table with shared features, row models, defaults, and registered components. |
| `createAppColumnHelper` | Creates column helpers with `TFeatures` and registered component types already bound. |
| `useTableContext` | Reads the current table inside registered table components. |
| `useCellContext` | Reads the current cell inside registered cell components. |
| `useHeaderContext` | Reads the current header/footer inside registered header components. |

### Component Columns

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

### Component Table Rendering

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

### Reusing The Component Registry

The Users and Products Vue components import the same `createAppColumnHelper` and `useAppTable` from `src/hooks/table.ts`. Each component owns its refs and columns, while the shared hook owns features, row models, row IDs, table components, cell components, and header/footer components.

## When To Use This Pattern

Use `createTableHook` when multiple tables should share features, row models, default options, or conventions. Use the standalone `useTable` API for a one-off table. Add the component registry only when the app wants standardized reusable table UI pieces.
