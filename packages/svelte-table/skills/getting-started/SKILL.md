---
name: getting-started
description: Create and render Table v9 with the svelte adapter. Route reusable createTableHook components, Query and Virtual integration, and framework setup; use table-state for reactive ownership.
metadata:
  type: framework
  library: '@tanstack/svelte-table'
  framework: svelte
  library_version: '9.2.6'
requires:
  - '@tanstack/table-core#core'
sources:
  - TanStack/table:docs/framework/svelte/guide/migrating.md
  - TanStack/table:examples/svelte/basic-create-table
  - TanStack/table:packages/svelte-table/src/index.ts
  - TanStack/table:docs/framework/svelte/guide/composable-tables.md
  - TanStack/table:examples/svelte/composable-tables
  - TanStack/table:packages/svelte-table/src/createTableHook.svelte.ts
  - TanStack/table:examples/svelte/with-tanstack-query
  - TanStack/table:docs/framework/svelte/guide/pagination.md
  - TanStack/table:docs/framework/svelte/guide/virtualization.md
  - TanStack/table:examples/svelte/virtualized-rows
  - TanStack/table:examples/svelte/virtualized-columns
  - TanStack/table:examples/svelte/virtualized-infinite-scrolling
---

# Svelte Table setup and integration

Before starting, run `intent load @tanstack/table-core#core` for the shared headless model and stable-input rules.

## Setup

Keep features and columns outside reactive work; expose changing rune values through getters.

```svelte
<script lang="ts">
  import {
    createTable,
    FlexRender,
    tableFeatures,
  } from '@tanstack/svelte-table'

  type Person = { firstName: string; age: number }
  const features = tableFeatures({})
  const columns = [
    { accessorKey: 'firstName', header: 'First name' },
    { accessorKey: 'age', header: 'Age' },
  ]
  let data = $state<Person[]>([{ firstName: 'Ada', age: 36 }])

  const table = createTable({
    features,
    columns,
    get data() {
      return data
    },
  })
</script>

<table>
  <thead>
    {#each table.getHeaderGroups() as group (group.id)}
      <tr
        >{#each group.headers as header (header.id)}<th
            >{#if !header.isPlaceholder}<FlexRender {header} />{/if}</th
          >{/each}</tr
      >
    {/each}
  </thead>
  <tbody>
    {#each table.getRowModel().rows as row (row.id)}
      <tr
        >{#each row.getAllCells() as cell (cell.id)}<td
            ><FlexRender {cell} /></td
          >{/each}</tr
      >
    {/each}
  </tbody>
</table>
```

## Essential constraints

V9 requires Svelte 5 and `createTable`. Expose changing runes through getters; `data` captured once cannot follow reassignment. Keep features and columns outside reactive work and use `$derived` for transformed arrays.

Table owns models and state. The application owns markup, CSS, interactions, and accessibility. Core-only tables use `row.getAllCells()`; visibility-aware methods need `columnVisibilityFeature`. Optional state and APIs require their features. Put row-model slots after their prerequisite features in `tableFeatures()`.

## Load by task

- For repeated features, defaults, typed contexts, or component registries, read [reusable app hooks](references/create-table-hook.md).
- For Query-backed data, server pages, sorting, filtering, or request keys, read [TanStack Query integration](references/with-tanstack-query.md).
- For virtual rows, columns, dynamic measurement, or infinite scrolling, read [TanStack Virtual integration](references/with-tanstack-virtual.md).
- For controlled state, tracked reads, or render subscriptions, read [table state](../table-state/SKILL.md).
- For feature registration, missing feature APIs, or processing ownership, run `intent load @tanstack/table-core#table-features` and read only references needed by the task.
- For v8 code, read the [migration checklist](../migrate-v8-to-v9/SKILL.md).

## API discovery

Inspect `node_modules/@tanstack/svelte-table/dist/index.d.ts`, then the exported adapter declarations for the installed version. Inspect optional core APIs under `node_modules/@tanstack/table-core/dist/features/`.
