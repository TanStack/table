---
title: Vue Table
---

The `@tanstack/vue-table` adapter wraps `@tanstack/table-core` with Vue-specific reactivity, rendering helpers, and types. It installs the Vue `coreReativityFeature` for you, so table atoms can participate in Vue refs, computed values, and watchers.

TanStack Table v9 is explicit about what a table uses. Register features with `_features`, and register client-side row model factories with `_rowModels`. The core row model is included by default, so a basic table can use `_rowModels: {}`.

## Creating a Table

Use `useTable` to create a Vue table instance. Table options can include Vue refs or computed values, including reactive `data`.

```ts
import { ref } from 'vue'
import { tableFeatures, useTable, type ColumnDef } from '@tanstack/vue-table'

type Person = {
  firstName: string
  lastName: string
  age: number
}

const _features = tableFeatures({})

const data = ref<Person[]>([])

const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    accessorKey: 'firstName',
    header: 'First name',
    cell: (info) => info.getValue(),
  },
]

const table = useTable({
  _features,
  _rowModels: {},
  columns,
  data,
})
```

For feature-specific row models, register the feature and put the row model factory under `_rowModels`.

```ts
import {
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/vue-table'

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
```

## Table State

Table state is managed with TanStack Store atoms in v9. For most tables, you do not need to manage table state yourself: set `initialState` when you need starting values, and use feature APIs like `table.nextPage()`, `table.setSorting(...)`, and `row.toggleSelected()` instead of mutating state directly.

Use `atoms` when your app should own one state slice with TanStack Store. Use `state` with the matching `on[State]Change` option for simple Vue state integration or migration paths. Selected table state is available on `table.state` when you pass a selector to `useTable`.

```ts
import { createAtom } from '@tanstack/vue-store'
import {
  rowPaginationFeature,
  tableFeatures,
  useTable,
  type PaginationState,
} from '@tanstack/vue-table'

const _features = tableFeatures({
  rowPaginationFeature,
})

const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = useTable({
  _features,
  _rowModels: {},
  columns,
  data,
  atoms: {
    pagination: paginationAtom,
  },
})
```

See the [Table State Guide](./guide/table-state.md) for selectors, external atoms, and state ownership patterns.

## Rendering Headers, Cells, and Footers

Use `FlexRender` to render column `header`, `cell`, and `footer` definitions. It handles plain values and Vue components.

```vue
<script setup lang="ts">
import { FlexRender } from '@tanstack/vue-table'
</script>

<template>
  <tbody>
    <tr v-for="row in table.getRowModel().rows" :key="row.id">
      <td v-for="cell in row.getVisibleCells()" :key="cell.id">
        <FlexRender :cell="cell" />
      </td>
    </tr>
  </tbody>
</template>
```

## createTableHook

`createTableHook` creates an app-specific table hook. Use it when multiple tables should share `_features`, `_rowModels`, default options, column helpers, and component conventions.

```ts
import { createTableHook, tableFeatures } from '@tanstack/vue-table'

const { useAppTable, createAppColumnHelper } = createTableHook({
  _features: tableFeatures({}),
  _rowModels: {},
})

const columnHelper = createAppColumnHelper<Person>()

const table = useAppTable({
  columns,
  data,
})
```

See the [Composable Tables example](./examples/composable-tables) for the full pattern.

## API Reference

See the [Vue API Reference](./reference/index.md).
