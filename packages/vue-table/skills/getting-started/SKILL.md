---
name: getting-started
description: >
  Create a Vue TanStack Table v9 table with useTable, explicit tableFeatures, stable columns/features, reactive ref or computed data, and Vue FlexRender without destructuring reactive snapshots.
metadata:
  type: framework
  library: '@tanstack/vue-table'
  framework: vue
  library_version: '9.0.0-beta.74'
requires:
  - '@tanstack/table-core#core'
  - '@tanstack/table-core#table-features'
sources:
  - 'TanStack/table:docs/framework/vue/guide/migrating.md'
  - 'TanStack/table:examples/vue/basic-use-table'
  - 'TanStack/table:packages/vue-table/src/index.ts'
---

This skill builds on `@tanstack/table-core#core` and `@tanstack/table-core#table-features`. Read them first for the headless model and explicit feature registration.

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

## Core Patterns

### Preserve Vue option shapes

`useTable` accepts refs/computed values and unwraps them while watching dependencies. Keep `data`, controlled state, and other reactive options as refs or computed values; keep static columns/features stable.

### Add a client row model explicitly

```ts
import {
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
} from '@tanstack/vue-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
})
```

The slot follows its prerequisite feature in the same call. Import individual `sortFn_*` built-ins and register only the ones your columns reference; the full `sortFns` registry object still works but bundles every built-in.

## Common Mistakes

### HIGH Flattening a ref into a snapshot

Wrong:

```ts
const table = useTable({ features, columns, data: data.value })
```

Correct:

```ts
const table = useTable({ features, columns, data })
```

Passing `.value` captures one array instead of letting the adapter watch the ref.

Source: `packages/vue-table/src/useTable.ts`

### HIGH Using the v8 entrypoint

Wrong:

```ts
const table = useVueTable({ data, columns, getCoreRowModel: getCoreRowModel() })
```

Correct:

```ts
const table = useTable({ features, columns, data })
```

V9 uses `useTable`; core processing is automatic and optional row models live in `tableFeatures`.

Source: `docs/framework/vue/guide/migrating.md`

### HIGH Assuming headless means prebuilt UI

Wrong:

```vue
<TanStackTable :table="table" />
```

Correct:

```vue
<td
  v-for="cell in row.getAllCells()"
  :key="cell.id"
><FlexRender :cell="cell" /></td>
```

The adapter renders definitions but owns no table component, CSS, or design-system integration.

Source: `examples/vue/basic-use-table/src/App.tsx`

## API Discovery

Inspect `node_modules/@tanstack/vue-table/dist/index.d.ts`, then `useTable.d.ts` and `FlexRender.d.ts`. Inspect core feature APIs in `node_modules/@tanstack/table-core/dist/features/<feature>/`.
