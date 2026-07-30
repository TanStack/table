---
name: with-tanstack-virtual
description: >
  Virtualize Svelte Table final row or column models with reactive counts and scroll targets, stable keys, dynamic measurement, absolute transforms, sticky regions, grid/flex sizing, and infinite data.
metadata:
  type: composition
  library: '@tanstack/svelte-table'
  framework: svelte
  library_version: '9.0.0-beta.59'
requires:
  - '@tanstack/table-core#core'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:docs/framework/svelte/guide/virtualization.md'
  - 'TanStack/table:examples/svelte/virtualized-rows'
  - 'TanStack/table:examples/svelte/virtualized-columns'
  - 'TanStack/table:examples/svelte/virtualized-infinite-scrolling'
---

This skill builds on `@tanstack/table-core#core`, `getting-started`, and `table-state`. Virtual is a rendering layer over Table’s final model, never a `tableFeatures` plugin.

## Setup

```svelte
<script lang="ts">
  import { get } from 'svelte/store'
  import { createVirtualizer } from '@tanstack/svelte-virtual'

  let scrollElement = $state<HTMLDivElement>()
  const rows = $derived(table.getRowModel().rows)
  const rowVirtualizer = createVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollElement ?? null,
    estimateSize: () => 34,
    getItemKey: (index) => rows[index]!.id,
    overscan: 5,
  })

  // The store adapter does not track getter options. Push reactive inputs.
  $effect(() => {
    get(rowVirtualizer).setOptions({
      count: rows.length,
      getScrollElement: () => scrollElement ?? null,
    })
  })
</script>

<div
  bind:this={scrollElement}
  style="height: 500px; overflow: auto; position: relative"
>
  <div style:height={`${$rowVirtualizer.getTotalSize()}px`}>
    {#each $rowVirtualizer.getVirtualItems() as item (item.key)}
      <div style={`position:absolute;transform:translateY(${item.start}px)`}>
        {rows[item.index].id}
      </div>
    {/each}
  </div>
</div>
```

## Core Patterns

### Virtualize visible models

Use `table.getRowModel().rows` for rows and `table.getVisibleLeafColumns()` for columns. Recompute counts when filtering, sorting, expansion, or visibility changes.

### Make CSS geometry agree with measurement

Use one scroll container, a total-size spacer, positioned items, and either fixed estimates or `measureElement`. For semantic tables with dynamic rows, follow the maintained grid/flex examples rather than assuming native table layout will honor transforms.

### Fetch before the virtual end

In infinite scrolling, compare the last virtual item with fetched row count, then request the next Query page only when more server rows exist and no fetch is active.

## Common Mistakes

### HIGH Virtualizing raw data

Wrong:

```ts
const rows = data
```

Correct:

```ts
const rows = $derived(table.getRowModel().rows)
```

Raw data ignores Table filtering, sorting, grouping, expansion, and pagination decisions.

Source: `examples/svelte/virtualized-rows/src/App.svelte`

### HIGH Expecting getter options to stay reactive

Wrong:

```ts
const virtualizer = createVirtualizer({
  get count() {
    return rows.length
  },
  getScrollElement,
})
```

Correct:

```ts
const virtualizer = createVirtualizer({ count: rows.length, getScrollElement })
$effect(() => {
  get(virtualizer).setOptions({
    count: rows.length,
    getScrollElement,
  })
})
```

`createVirtualizer` returns a Svelte store, and its adapter does not track getter options. Push rune-derived counts and the bound scroll element with `$effect` and `get(store).setOptions(...)`.

Source: `examples/svelte/virtualized-rows/src/App.svelte`

### HIGH Omitting the geometry contract

Wrong:

```svelte
{#each rowVirtualizer.getVirtualItems() as item}<div>
    {rows[item.index].id}
  </div>{/each}
```

Correct:

```svelte
<div style:height={`${$rowVirtualizer.getTotalSize()}px`}>
  <div style="position:absolute"></div>
</div>
```

Virtual supplies ranges and measurements, not spacer height, transforms, sticky regions, or column widths. In markup, call virtualizer methods through the store auto-subscription (`$rowVirtualizer`); use `get(rowVirtualizer)` in script code.

Source: `docs/framework/svelte/guide/virtualization.md`

## API Discovery

Inspect installed `@tanstack/svelte-table/dist/` for Table APIs and `@tanstack/svelte-virtual/dist/` for the exact virtualizer options. Use the maintained Svelte examples for layout combinations.
