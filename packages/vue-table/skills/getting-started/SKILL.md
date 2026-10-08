---
name: getting-started
description: Create and render Table v9 with the vue adapter. Route reusable createTableHook components, Query and Virtual integration, and framework setup; use table-state for reactive ownership.
metadata:
  type: framework
  library: '@tanstack/vue-table'
  framework: vue
  library_version: '9.2.8'
requires:
  - '@tanstack/table-core#core'
sources:
  - TanStack/table:docs/framework/vue/guide/migrating.md
  - TanStack/table:examples/vue/basic-use-table
  - TanStack/table:packages/vue-table/src/index.ts
  - TanStack/table:docs/framework/vue/guide/composable-tables.md
  - TanStack/table:examples/vue/composable-tables
  - TanStack/table:packages/vue-table/src/createTableHook.ts
  - TanStack/table:examples/vue/with-tanstack-query
  - TanStack/table:docs/framework/vue/guide/pagination.md
  - TanStack/table:docs/framework/vue/guide/virtualization.md
  - TanStack/table:examples/vue/virtualized-rows
  - TanStack/table:examples/vue/virtualized-columns
  - TanStack/table:examples/vue/virtualized-infinite-scrolling
---

# Vue Table setup and integration

Before starting, run `intent load @tanstack/table-core#core` for the shared headless model and stable-input rules.

## Setup

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { FlexRender, tableFeatures, useTable } from '@tanstack/vue-table'

type Person = { name: string; age: number }
const features = tableFeatures({})
const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
]
const data = ref<Person[]>([{ name: 'Ada', age: 36 }])
const table = useTable({ features, columns, data })
</script>

<template>
  <table>
    <thead>
      <tr v-for="group in table.getHeaderGroups()" :key="group.id">
        <th v-for="header in group.headers" :key="header.id">
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

## Essential constraints

Use `useTable` with a ref, computed value, or reactive getter for changing data. Passing `data.value` captures one array and loses later updates. Keep static features and columns stable; derive transformed arrays with `computed`.

Table owns models and state. The application owns markup, CSS, interactions, and accessibility. Core-only tables use `row.getAllCells()`; visibility-aware methods need `columnVisibilityFeature`. Optional state and APIs require their features. Put row-model slots after their prerequisite features in `tableFeatures()`.

## Load by task

- For repeated features, defaults, typed contexts, or component registries, read [reusable app hooks](references/create-table-hook.md).
- For Query-backed data, server pages, sorting, filtering, or request keys, read [TanStack Query integration](references/with-tanstack-query.md).
- For virtual rows, columns, dynamic measurement, or infinite scrolling, read [TanStack Virtual integration](references/with-tanstack-virtual.md).
- For controlled state, tracked reads, or render subscriptions, read [table state](../table-state/SKILL.md).
- For feature registration, missing feature APIs, or processing ownership, run `intent load @tanstack/table-core#table-features` and read only references needed by the task.
- For v8 code, read the [migration checklist](../migrate-v8-to-v9/SKILL.md).

## API discovery

Inspect `node_modules/@tanstack/vue-table/dist/index.d.ts`, then the exported adapter declarations for the installed version. Inspect optional core APIs under `node_modules/@tanstack/table-core/dist/features/`.
