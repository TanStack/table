---
name: getting-started
description: >
  Create a Svelte 5 TanStack Table v9 table with createTable, explicit tableFeatures, rune-backed data getters, stable static inputs, FlexRender, and headless markup. Load when replacing createSvelteTable or pre-rune patterns.
metadata:
  type: framework
  library: '@tanstack/svelte-table'
  framework: svelte
  library_version: '9.0.1'
requires:
  - '@tanstack/table-core#core'
  - '@tanstack/table-core#table-features'
sources:
  - 'TanStack/table:docs/framework/svelte/guide/migrating.md'
  - 'TanStack/table:examples/svelte/basic-create-table'
  - 'TanStack/table:packages/svelte-table/src/index.ts'
---

This skill builds on `@tanstack/table-core#core` and `@tanstack/table-core#table-features`. Read them first for the headless model and feature registration.

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

## Core Patterns

### Add only the processing feature you need

```ts
import {
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
} from '@tanstack/svelte-table'

export const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
})
```

The row-model slot follows its prerequisite feature in the same call. Import individual `sortFn_*` built-ins and register only the ones your columns reference; the full `sortFns` registry object still works but bundles every built-in.

### Treat markup and styles as application code

With core-only `tableFeatures({})`, render `row.getAllCells()`. Use visibility-aware APIs such as `row.getVisibleCells()` only after registering `columnVisibilityFeature`. Call feature APIs from real Svelte event handlers. Table supplies no component-library markup, CSS, or accessibility behavior.

## Common Mistakes

### HIGH Passing a rune snapshot as data

Wrong:

```ts
const table = createTable({ features, columns, data })
```

Correct:

```ts
const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
})
```

The getter makes `$effect.pre` observe current rune data rather than the value captured at construction.

Source: `packages/svelte-table/src/createTable.svelte.ts`

### HIGH Using the removed v8 constructor

Wrong:

```ts
const table = createSvelteTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
})
```

Correct:

```ts
const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
})
```

V9 requires Svelte 5, `createTable`, and explicit features; the core row model is automatic.

Source: `docs/framework/svelte/guide/migrating.md`

### HIGH Omitting a feature behind an API

Wrong:

```ts
const features = tableFeatures({})
table.setSorting([{ id: 'age', desc: true }])
```

Correct:

```ts
const features = tableFeatures({ rowSortingFeature })
```

Feature state and APIs exist only when that feature is registered.

Source: `docs/framework/svelte/guide/migrating.md`

## API Discovery

Inspect `node_modules/@tanstack/svelte-table/dist/index.d.ts`, then the exported implementation. Inspect core and feature APIs through `node_modules/@tanstack/table-core/dist/index.d.ts` and `dist/features/<feature>/`.
