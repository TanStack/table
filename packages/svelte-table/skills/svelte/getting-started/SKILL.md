---
name: svelte/getting-started
description: >
  End-to-end first-table journey for `@tanstack/svelte-table@9` on Svelte 5. Install the adapter,
  declare `features` with `tableFeatures()` (including row-model factories and `*Fns` registries as
  feature slots), build a typed column helper with both `TFeatures` and `TData` generics, instantiate
  the table with `createTable(options)` using `$state` data and `get data()` reactive option getters,
  and render with `FlexRender`. Svelte 5+ only — Svelte 3/4 must use v8.
type: lifecycle
library: tanstack-table
framework: svelte
library_version: '9.0.0-alpha.48'
requires:
  - setup
  - column-definitions
  - state-management
  - svelte/table-state
sources:
  - TanStack/table:docs/installation.md
  - TanStack/table:docs/framework/svelte/svelte-table.md
  - TanStack/table:examples/svelte/basic-create-table/
  - TanStack/table:examples/svelte/basic-app-table/
  - TanStack/table:examples/svelte/basic-snippets/
  - TanStack/table:packages/svelte-table/src/index.ts
---

# Getting Started — Svelte

A first working `@tanstack/svelte-table` v9 table from a blank Svelte 5 project. Read this
end-to-end before searching the docs — the v9 shape diverges enough from v8 (and from your
muscle memory) that skimming will produce broken code.

## CRITICAL: Svelte version

**`@tanstack/svelte-table@9` requires Svelte 5 or newer.** The adapter is built on runes
(`$state`, `$derived.by`, `$effect.pre`). If your project is on Svelte 3 or 4, do **one** of:

- Upgrade the project to Svelte 5, then install v9.
- Stay on `@tanstack/svelte-table@8` for that project.

There is no shim, no `/legacy` export, and no support path that runs v9 on Svelte 4.

## 1. Install

```bash
pnpm add @tanstack/svelte-table
# optional: external atoms / fine-grained selectors
pnpm add @tanstack/svelte-store
```

You do **not** install `@tanstack/table-core` separately — the Svelte adapter re-exports
everything you need (column helpers, feature objects, row-model factories, types).

## 2. Define `features`

v9 is explicit. You opt in to every feature and every row model. The core row model is
included by default, so the minimum viable table is:

```ts
const features = tableFeatures({})
```

For anything beyond a flat table, register the features you'll use along with the matching
row-model factories and `*Fns` registries — all as slots inside `tableFeatures`:

```ts
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/svelte-table'

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  columnFilteringFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortFns,
  filterFns,
})
```

**Skipping a feature** in `features` means its state slice does not exist on `table.atoms`,
its options on `createTable` do nothing, and its derived APIs (`table.setSorting`,
`column.getCanSort`) are not on the instance.

## 3. Type your data and define columns

```ts
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: 'relationship' | 'complicated' | 'single'
  progress: number
}
```

Both `ColumnDef` and the column helper take the two generics `<typeof features, TData>`:

```ts
import { createColumnHelper, type ColumnDef } from '@tanstack/svelte-table'

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: () => 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', { header: 'Age' }),
  columnHelper.accessor('visits', { header: 'Visits' }),
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('progress', { header: 'Profile Progress' }),
])
```

Or use raw `ColumnDef` arrays if you don't want the helper:

```ts
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
]
```

## 4. Create the table

Use Svelte 5 `$state` for the data and pass it through a **reactive getter** so the table
re-evaluates `data` when the rune changes. The same pattern applies for any other reactive
option (`columns`, `rowCount`, `state.*`).

```svelte
<script lang="ts">
  import { createTable, tableFeatures } from '@tanstack/svelte-table'
  import { makeData, type Person } from './makeData'

  const features = tableFeatures({})

  // ... columns from step 3 ...

  let data = $state<Person[]>(makeData(20))

  const refreshData = () => {
    data = makeData(20)
  }

  const table = createTable({
    features,
    columns,
    get data() {
      return data
    },
  })
</script>
```

`createTable` syncs options inside `$effect.pre`, so external `$state` updates flow into the
table **before** the DOM reads `getRowModel()` — no stale-frame bugs.

## 5. Render with `FlexRender`

`FlexRender` handles plain strings, function renderers, component renderers
(`renderComponent`), and snippet renderers (`renderSnippet`).

```svelte
<script lang="ts">
  import { FlexRender } from '@tanstack/svelte-table'
</script>

<button onclick={refreshData}>Regenerate</button>

<table>
  <thead>
    {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
      <tr>
        {#each headerGroup.headers as header (header.id)}
          <th>
            {#if !header.isPlaceholder}
              <FlexRender {header} />
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
          <td><FlexRender {cell} /></td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
```

**Key the `{#each}` blocks on stable ids.** Without keys, Svelte recreates nodes and loses
focus, scroll, and any per-row component state.

## 6. Adding a feature — pagination

```svelte
<script lang="ts">
  import {
    createPaginatedRowModel,
    createTable,
    rowPaginationFeature,
    tableFeatures,
  } from '@tanstack/svelte-table'

  const features = tableFeatures({
    rowPaginationFeature,
    paginatedRowModel: createPaginatedRowModel(),
  })

  const table = createTable({
    features,
    columns,
    get data() {
      return data
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })
</script>

<div>
  <button
    onclick={() => table.previousPage()}
    disabled={!table.getCanPreviousPage()}>Prev</button
  >
  <span
    >Page {table.atoms.pagination.get().pageIndex + 1} of {table.getPageCount()}</span
  >
  <button onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}
    >Next</button
  >
</div>
```

To make pagination reactive in the controls, either pass a selector to `createTable` or use
`subscribeTable`:

```ts
import { subscribeTable } from '@tanstack/svelte-table'

const pagination = subscribeTable(table.atoms.pagination)
// pagination.current.pageIndex is reactive
```

## 7. `createTableHook` (when you have more than one table)

For apps with multiple tables, define `features` (including row-model factories) and shared components once:

```ts
// hooks/table.ts
import {
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/svelte-table'

export const { createAppTable, createAppColumnHelper } = createTableHook({
  features: tableFeatures({
    rowPaginationFeature,
    rowSortingFeature,
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
    sortFns,
  }),
})
```

```svelte
<script lang="ts">
  import { createAppColumnHelper, createAppTable } from './hooks/table'

  const columnHelper = createAppColumnHelper<Person>()
  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', { header: 'First' }),
  ])

  const table = createAppTable({
    columns,
    get data() {
      return data
    },
  })
</script>
```

## Common failure modes

- **Svelte 3/4.** Adapter will not work. See top of file.
- **`createSvelteTable` / `useSvelteTable` / `getCoreRowModel`** — all v8 names. v9 uses
  `createTable` with row-model factories registered as slots in `tableFeatures({ paginatedRowModel: createPaginatedRowModel(), ... })`.
- **Plain `data` instead of `get data()` getter.** Table will not see data updates. Always
  pass a reactive getter for state that lives in `$state`.
- **Missing feature in `features`.** `table.setSorting` / `column.getCanSort` won't exist.
  TypeScript will tell you; if it doesn't, you're missing the `<typeof features, TData>`
  generics on the column helper or `ColumnDef`.
- **Plain object instead of `tableFeatures({...})`.** Loses typed atom keys; you'll get
  `unknown` state shapes everywhere.
- **Unkeyed `{#each}` blocks.** Reuse bugs (focus jumps, wrong row selected).
- **Reimplementing built-ins.** If you write a manual sort comparator across rows, you're
  re-doing `rowSortingFeature`. Register it instead.

## Next steps

- `tanstack-table/svelte/table-state` — reactivity model, selectors, subscribeTable, ownership.
- `tanstack-table/core/filtering` / `pagination` / `sorting` / `row-selection` — feature-by-feature.
- `tanstack-table/svelte/compose-with-tanstack-query` — server-side data.
- `tanstack-table/svelte/compose-with-tanstack-virtual` — large datasets.
- `tanstack-table/svelte/production-readiness` — selector tuning, bundle size.
