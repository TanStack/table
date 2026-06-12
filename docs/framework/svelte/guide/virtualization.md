---
title: Virtualization (Svelte) Guide
---

## Examples

Want to skip to the implementation? Check out these Svelte examples:

- [Virtualized Columns](../examples/virtualized-columns)
- [Virtualized Rows](../examples/virtualized-rows)
- [Virtualized Infinite Scrolling](../examples/virtualized-infinite-scrolling)

Use getters for reactive inputs such as `data` when passing Svelte state to `createTable`.

### Svelte Setup

Install and import the Svelte virtualizer adapter from `@tanstack/svelte-virtual`. TanStack Table still owns rows, columns, and table state; the virtualizer owns scroll indexes and measurements.
Also see the [TanStack Virtual table example](https://tanstack.com/virtual/latest/docs/framework/svelte/examples/table).

## Virtualization (Svelte) Guide

The TanStack Table packages do not come with any virtualization APIs or features built in. Virtualization is a rendering strategy, not a table feature. You can use TanStack Table with any virtualization library, but the official examples use TanStack Virtual.

TanStack Table and TanStack Virtual solve different parts of the problem:

- TanStack Table builds the row models, columns, headers, cells, sizing, sorting, filtering, and other table state.
- TanStack Virtual decides which item indexes should be rendered for the current scroll position.
- Your table renderer maps those virtual indexes back to rows, headers, and cells.

### When To Use Virtualization

Use virtualization when your table has a very large number of rows, columns, or both. Virtualization keeps the DOM small by only rendering the items that are visible in the scroll viewport plus a small overscan buffer.

Virtualization is not a replacement for server-side pagination, filtering, or sorting. If the data is virtualized on the client, the data still needs to exist on the client. If your dataset is too large to load into the browser, use server-side data operations or infinite scrolling.

For small tables, normal rendering is simpler and usually preferable.

### Install TanStack Virtual

Install the Svelte virtualizer adapter:

```sh
npm install @tanstack/svelte-virtual
```

The Svelte examples use `createVirtualizer` from `@tanstack/svelte-virtual`. TanStack Table still owns rows, columns, headers, cells, sizing, sorting, filtering, and other table state; TanStack Virtual decides which item indexes should render for the current scroll position.

The table itself is set up like any other v9 table. Declare your features with `tableFeatures()` and create the table with `createTable`; nothing about virtualization changes the table setup.

```ts
import {
  columnSizingFeature,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
  tableFeatures,
  createTable,
} from '@tanstack/svelte-table'
import { createVirtualizer } from '@tanstack/svelte-virtual'

const features = tableFeatures({
  columnSizingFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
})
```

### The Basic Pattern

Most virtualized table implementations follow the same pattern:

1. Create a fixed-height scroll container.
2. Pass the scroll element to the virtualizer.
3. Use `table.getRowModel().rows` or `table.getVisibleLeafColumns()` as the source list.
4. Configure `count`, `estimateSize`, `overscan`, and optional `measureElement`.
5. Render only virtual items.
6. Use virtual offsets or spacer padding to preserve the full scroll geometry.

Here is a compact row virtualization example:

```ts
import { get } from 'svelte/store'

let tableContainerRef = $state<HTMLDivElement | undefined>(undefined)

const rows = $derived(table.getRowModel().rows)

const rowVirtualizer = createVirtualizer({
  get count() {
    return rows.length
  },
  getScrollElement: () => tableContainerRef ?? null,
  estimateSize: () => 33,
  overscan: 5,
})

// The svelte-virtual store adapter does not reactively track getter options,
// so push count changes (data refresh, filtering, expansion) to the virtualizer.
$effect(() => {
  get(rowVirtualizer).setOptions({ count: rows.length })
})
```

```svelte
<tbody
  style="height: {$rowVirtualizer.getTotalSize()}px; position: relative;"
>
  {#each $rowVirtualizer.getVirtualItems() as virtualRow (virtualRow.key)}
    {@const row = rows[virtualRow.index]}
    <tr
      style="position: absolute; transform: translateY({virtualRow.start}px); width: 100%;"
    >
      {#each row.getVisibleCells() as cell (cell.id)}
        <td><FlexRender cell={cell} /></td>
      {/each}
    </tr>
  {/each}
</tbody>
```

### Virtualized Rows

The [virtualized rows examples](../examples/virtualized-rows) show how to render large row counts while keeping the DOM small. The examples are available for React, Solid, Svelte, Vue, Angular, and Lit.

The core idea is that sorting, filtering, grouping, and other row-model work still comes from TanStack Table. The virtualizer reads from the final table row model:

```ts
const rows = $derived(table.getRowModel().rows)
```

The row virtualizer is configured with `count: rows.length`, a row height estimate, the scroll container, and an overscan value. The `tbody` is given the full virtual height with `rowVirtualizer.getTotalSize()`, while each rendered row is absolutely positioned with `transform: translateY(...)`.

The examples render cells from the current row with APIs like `row.getVisibleCells()` or `row.getAllCells()`, depending on whether the example needs visibility-aware cells or all cells.

The official examples use large generated datasets, commonly tens or hundreds of thousands of rows. They also support dynamic row heights by using `measureElement` when possible. The examples skip dynamic row measurement in Firefox because Firefox can measure table border height differently.

### Virtualized Columns

The [virtualized columns examples](../examples/virtualized-columns) show how to render large row and column counts. The examples are available for React, Solid, Svelte, Vue, Angular, and Lit.

Column virtualization uses the current visible column list:

```ts
const visibleColumns = $derived(table.getVisibleLeafColumns())
```

The column virtualizer is configured for horizontal virtualization:

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

// Keep the virtualizer's count in sync when column visibility changes.
$effect(() => {
  get(columnVirtualizer).setOptions({ count: visibleColumns.length })
})
```

Column virtualization uses a different rendering strategy than row virtualization. Instead of absolutely positioning columns, the examples add fake spacer cells to the left and right:

```ts
const virtualPaddingLeft = $derived.by(() => {
  const virtualColumns = $columnVirtualizer.getVirtualItems()
  return virtualColumns[0]?.start ?? 0
})
const virtualPaddingRight = $derived.by(() => {
  const virtualColumns = $columnVirtualizer.getVirtualItems()
  return (
    $columnVirtualizer.getTotalSize() -
    (virtualColumns[virtualColumns.length - 1]?.end ?? 0)
  )
})
```

`createVirtualizer` returns a Svelte store, so read it with the `$columnVirtualizer` auto-subscription (or `get(columnVirtualizer)` outside reactive contexts).

Those spacer cells preserve the horizontal scroll width while the renderer only mounts the virtual columns. This approach keeps row rendering table-like and allows dynamic row height measurement to keep working.

### Virtualized Rows And Columns Together

The official virtualized columns examples also virtualize rows. In those examples:

- The row virtualizer controls vertical positioning and total body height.
- The column virtualizer controls horizontal header/cell rendering and left/right spacer cells.
- `virtualRow.index` maps to `rows[virtualRow.index]`.
- `virtualColumn.index` maps to `visibleCells[virtualColumn.index]`.

Always use virtual indexes against the same current row and column lists returned by the table. If sorting, filtering, pagination, grouping, or column visibility changes, recompute the virtualized rows and columns from the current table state.

### Virtualized Infinite Scrolling

The [virtualized infinite scrolling examples](../examples/virtualized-infinite-scrolling) combine row virtualization with progressive data fetching. The examples are available for React, Solid, Svelte, Vue, Angular, and Lit.

The common pattern is:

1. Fetch a page of rows.
2. Flatten fetched pages into the table `data`.
3. Use row virtualization over the loaded rows.
4. Listen to scroll events on the table container.
5. Fetch the next page when the user scrolls near the bottom.

The Svelte infinite scrolling pattern can use TanStack Query or any other data-fetching layer.

```ts
const { scrollHeight, scrollTop, clientHeight } = scrollElement

if (scrollHeight - scrollTop - clientHeight < 500) {
  fetchNextPage()
}
```

If sorting is handled by the server, use manual sorting so the fetched data reflects the whole backend dataset rather than only the currently loaded rows. When sorting changes and the fetched dataset is replaced, scroll back to the top with `rowVirtualizer.scrollToIndex(0)`.

### Dynamic Row Heights

Dynamic row heights are useful when content can wrap or expand. They are also more complex than fixed-height rows.

Use `estimateSize` as the virtualizer's initial guess:

```ts
estimateSize: () => 33
```

Then use `measureElement` to refine the actual row height after rendering:

```ts
import { get } from 'svelte/store'

function measureElement(node: HTMLTableRowElement) {
  get(rowVirtualizer).measureElement(node)
}
```

```svelte
<tr
  data-index={virtualRow.index}
  use:measureElement
>
```

Set `data-index` on each row so the virtualizer can associate measurements with the correct item. In Svelte, the idiomatic mechanism is a [Svelte action](https://svelte.dev/docs/svelte/use) (`use:measureElement`) like the one above; this is exactly what the official [virtualized rows example](../examples/virtualized-rows) does. The example also skips dynamic measurement in Firefox, which measures table border heights differently.

Overscan helps avoid blank regions while measurements settle. If every row has a known fixed height, skip dynamic measurement and use the fixed height estimate instead.

### Sticky Headers And Semantic Table Markup

The examples still use semantic table tags, but they change table layout CSS to support virtual positioning and sticky headers.

Dynamic row virtualization commonly requires:

```css
table {
  display: grid;
}

thead {
  display: grid;
  position: sticky;
  top: 0;
}

tr {
  display: flex;
}
```

Rows are absolutely positioned inside a relatively positioned `tbody`, and cells use flex sizing so they can match `column.getSize()` or `cell.column.getSize()`. This is intentional. Native table layout does not work well with dynamic-height virtual rows that are positioned independently.

### Performance Tips

- Keep virtualizers near the components that render the virtualized items.
- Avoid re-rendering the full table body on every scroll.
- Keep row, column, and data references stable where possible.
- Use `overscan` deliberately. More overscan reduces visible blanking, while less overscan reduces DOM nodes.
- Avoid expensive cell renderers in very large virtualized tables.
- Test production builds. Framework development builds can be slower than production builds; profile production bundles before optimizing.
- Prefer fixed row sizes when the UI allows it.
- For column virtualization, use `column.getSize()`, `header.getSize()`, and `cell.column.getSize()` consistently.
