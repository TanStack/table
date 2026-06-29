---
name: svelte/compose-with-tanstack-virtual
description: >
  `@tanstack/svelte-table` does not include virtualization — pair it with
  `@tanstack/svelte-virtual`. Use `createVirtualizer({ count, estimateSize, getScrollElement,
  ... })`, feed `table.getRowModel().rows.length` as `count`, render only
  `$rowVirtualizer.getVirtualItems()`, position rows with `transform: translateY(...)` and a
  container of `getTotalSize()`. Use `measureElement` actions for dynamic row heights. Svelte 5+
  only — `$state` for refs, `$effect` to sync count.
type: composition
library: tanstack-table
framework: svelte
library_version: '9.0.0-alpha.48'
requires:
  - svelte/table-state
  - row-expanding
sources:
  - TanStack/table:docs/guide/virtualization.md
  - TanStack/table:examples/svelte/virtualized-rows/
  - TanStack/table:examples/svelte/virtualized-columns/
  - TanStack/table:examples/svelte/virtualized-infinite-scrolling/
---

# Compose with TanStack Virtual (Svelte)

TanStack Table is **not** a virtualizer. For lists / grids past a few thousand rows (or with
heavy per-row markup), pair it with `@tanstack/svelte-virtual`.

## Install

```bash
pnpm add @tanstack/svelte-virtual
```

## Core mental model

- TanStack Table gives you `rows: row[]` (already filtered / sorted / paged / grouped).
- TanStack Virtual takes `count` (the length) and returns `virtualItems` (the slice currently
  in view).
- You render only those virtual items, absolutely positioned, inside a container sized to
  `getTotalSize()` pixels.

`createVirtualizer` returns a Svelte store. Read its current value with `$rowVirtualizer` or
`get(rowVirtualizer)` (from `svelte/store`).

## Basic row virtualization

```svelte
<script lang="ts">
  import {
    columnSizingFeature,
    createSortedRowModel,
    createTable,
    rowSortingFeature,
    sortFns,
    tableFeatures,
    FlexRender,
  } from '@tanstack/svelte-table'
  import { createVirtualizer } from '@tanstack/svelte-virtual'
  import { get } from 'svelte/store'

  const features = tableFeatures({
    columnSizingFeature,
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns,
  })

  let data = $state<Person[]>(makeData(200_000))

  const table = createTable({
    features,
    columns,
    get data() {
      return data
    },
  })

  let tableContainerRef = $state<HTMLDivElement | undefined>(undefined)

  const rows = $derived(table.getRowModel().rows)

  const rowVirtualizer = createVirtualizer({
    get count() {
      return rows.length
    },
    estimateSize: () => 33,
    getScrollElement: () => tableContainerRef ?? null,
    overscan: 5,
  })

  // svelte-virtual's store adapter does not reactively track getter options;
  // push updates explicitly when ref / count change.
  $effect(() => {
    if (tableContainerRef) {
      get(rowVirtualizer).setOptions({
        getScrollElement: () => tableContainerRef ?? null,
      })
    }
  })

  $effect(() => {
    get(rowVirtualizer).setOptions({ count: rows.length })
  })
</script>

<div
  bind:this={tableContainerRef}
  style="overflow: auto; position: relative; height: 800px;"
>
  <table style="display: grid;">
    <thead style="display: grid; position: sticky; top: 0; z-index: 1;">
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
        <tr style="display: flex; width: 100%;">
          {#each headerGroup.headers as header (header.id)}
            <th style="display: flex; width: {header.getSize()}px;">
              <FlexRender {header} />
            </th>
          {/each}
        </tr>
      {/each}
    </thead>
    <tbody
      style="display: grid; position: relative; height: {$rowVirtualizer.getTotalSize()}px;"
    >
      {#each $rowVirtualizer.getVirtualItems() as virtualRow (virtualRow.index)}
        {@const row = rows[virtualRow.index]}
        <tr
          data-index={virtualRow.index}
          style="display: flex; position: absolute; transform: translateY({virtualRow.start}px); width: 100%;"
        >
          {#each row.getAllCells() as cell (cell.id)}
            <td style="display: flex; width: {cell.column.getSize()}px;">
              <FlexRender {cell} />
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
```

Why `display: grid` / `flex` instead of native table layout? Because the rows are absolutely
positioned, the browser's native table layout algorithm can't size columns from non-flowing
rows. CSS layout takes over.

## Dynamic row heights (`measureElement`)

For variable row heights (multi-line cells, expanding rows), measure rendered nodes with the
virtualizer's `measureElement` API.

```svelte
<script lang="ts">
  const rowVirtualizer = createVirtualizer({
    get count() {
      return rows.length
    },
    estimateSize: () => 33,
    getScrollElement: () => tableContainerRef ?? null,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })

  // Svelte action wrapping the virtualizer's measure call.
  function measureElement(node: HTMLTableRowElement) {
    get(rowVirtualizer).measureElement(node)
  }
</script>

<tr use:measureElement data-index={virtualRow.index} ...>...</tr>
```

`data-index` is required — the virtualizer uses it to map a measured element back to its
virtual item.

> Firefox measures table-border rows incorrectly. The above guards against measuring there and
> falls back to the estimate.

## Column virtualization

`createVirtualizer` with `horizontal: true` against `table.getVisibleLeafColumns()`. Same
pattern — only render `getVirtualItems()` cells per row, position with `translateX`.

```ts
const columnVirtualizer = createVirtualizer({
  get count() {
    return visibleColumns.length
  },
  estimateSize: (index) => visibleColumns[index].getSize(),
  getScrollElement: () => tableContainerRef ?? null,
  horizontal: true,
  overscan: 3,
})
```

For combined row + column virtualization, render the row virtualizer's items, and inside each
row render the column virtualizer's items. See `examples/svelte/virtualized-columns/`.

## Infinite scroll (load more on near-bottom)

Subscribe to the virtualizer's `getVirtualItems()` and check the last one's index against your
total available count.

```ts
import { createInfiniteQuery } from '@tanstack/svelte-query'

const infiniteQuery = createInfiniteQuery(() => ({
  queryKey: ['people-infinite'],
  queryFn: ({ pageParam }) => fetchPeople({ cursor: pageParam, pageSize: 50 }),
  initialPageParam: undefined as string | undefined,
  getNextPageParam: (last) => last.nextCursor,
}))

const flatData = $derived(
  infiniteQuery.data?.pages.flatMap((p) => p.rows) ?? [],
)

const table = createTable({
  features: tableFeatures({}),
  columns,
  get data() {
    return flatData
  },
})

const rows = $derived(table.getRowModel().rows)

const rowVirtualizer = createVirtualizer({
  get count() {
    return rows.length
  },
  estimateSize: () => 33,
  getScrollElement: () => tableContainerRef ?? null,
  overscan: 10,
})

$effect(() => {
  const items = $rowVirtualizer.getVirtualItems()
  const last = items[items.length - 1]
  if (
    last &&
    last.index >= rows.length - 1 &&
    infiniteQuery.hasNextPage &&
    !infiniteQuery.isFetchingNextPage
  ) {
    infiniteQuery.fetchNextPage()
  }
})
```

## Interaction with row expanding

If `rowExpandingFeature` is registered, `table.getRowModel().rows` already flattens expanded
sub-rows into a single sequential list. The virtualizer just sees a longer list — no special
handling needed.

For variable row heights driven by expand state, you'll want `measureElement` so the
container resizes when a row expands.

## Pagination vs. virtualization

Pick one. Virtualization is for "render all rows but render only the visible window".
Pagination is for "the user navigates discrete pages". Combining them usually means you don't
need either — drop pagination and let the virtualizer handle the rendering window.

## Common failure modes

- **Forgot to push `count` updates.** `svelte-virtual` does not auto-track `get count()` —
  use `$effect` + `setOptions({ count })`.
- **Native table layout with virtualized rows.** Columns collapse because absolutely
  positioned rows don't contribute to layout. Use `display: grid` / `flex`.
- **No `data-index` on `<tr>`.** `measureElement` can't map back to virtual items.
- **No `transform: translateY`.** Rows render at `top: 0` and stack visually.
- **Missing container `height`.** No overflow, no scroll, no virtualization.
- **Calling `get(rowVirtualizer).getVirtualItems()` in template.** Wrong access pattern;
  use `$rowVirtualizer.getVirtualItems()` (store auto-subscribe) or be sure to
  `import { get } from 'svelte/store'`.
- **Reimplementing windowing manually.** Don't.

## Related skills

- `tanstack-table/svelte/table-state` — `getRowModel()` and the reactivity model.
- `tanstack-table/core/row-expanding` — flattening sub-rows for virtualization.
- `tanstack-table/svelte/compose-with-tanstack-query` — infinite-scroll data source.
