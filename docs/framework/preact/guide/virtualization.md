---
title: Virtualization (Preact) Guide
---

## Examples

This repository does not currently include official Preact virtualization examples. The table-side APIs in this guide use `@tanstack/preact-table`. For the rendering side, the React virtualized examples translate almost directly to Preact:

- [Virtualized Rows (React)](https://tanstack.com/table/latest/docs/framework/react/examples/virtualized-rows)
- [Virtualized Columns (React)](https://tanstack.com/table/latest/docs/framework/react/examples/virtualized-columns)
- [Virtualized Infinite Scrolling (React)](https://tanstack.com/table/latest/docs/framework/react/examples/virtualized-infinite-scrolling)

Also see the [TanStack Virtual table example](https://tanstack.com/virtual/latest/docs/framework/react/examples/table).

## Virtualization (Preact) Guide

The TanStack Table packages do not come with any virtualization APIs or features built in. Virtualization is a rendering strategy, not a table feature. You can use TanStack Table with any virtualization library, but the official examples use TanStack Virtual.

TanStack Table and TanStack Virtual solve different parts of the problem:

- TanStack Table builds the row models, columns, headers, cells, sizing, sorting, filtering, and other table state.
- TanStack Virtual decides which item indexes should be rendered for the current scroll position.
- Your table renderer maps those virtual indexes back to rows, headers, and cells.

### When To Use Virtualization

Use virtualization when your table has a very large number of rows, columns, or both. Virtualization keeps the DOM small by only rendering the items that are visible in the scroll viewport plus a small overscan buffer.

Virtualization is not a replacement for server-side pagination, filtering, or sorting. If the data is virtualized on the client, the data still needs to exist on the client. If your dataset is too large to load into the browser, use server-side data operations or infinite scrolling.

For small tables, normal rendering is simpler and usually preferable.

### Install A Virtualizer

There is no Preact-specific TanStack Virtual adapter. You have two good options:

1. Use `@tanstack/react-virtual` in a Preact app that aliases `react` to `preact/compat` (the standard setup for using React libraries with Preact). The `useVirtualizer` hook works as-is, and the snippets in this guide assume this setup.
2. Use `@tanstack/virtual-core` directly and wire its `Virtualizer` class to Preact yourself, or use any other virtualization library that fits your app.

```sh
npm install @tanstack/react-virtual
```

Either way, the job is the same: map the virtualizer's virtual indexes back to `table.getRowModel().rows` or `table.getVisibleLeafColumns()`.

The table itself is set up like any other v9 table. Declare your features with `tableFeatures()` and create the table with `useTable`; nothing about virtualization changes the table setup.

```tsx
import {
  columnSizingFeature,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'
import { useVirtualizer } from '@tanstack/react-virtual' // requires the preact/compat alias

const features = tableFeatures({
  columnSizingFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const table = useTable({
  features,
  columns,
  data,
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

```tsx
const rows = table.getRowModel().rows

const rowVirtualizer = useVirtualizer({
  count: rows.length,
  getScrollElement: () => tableContainerRef.current,
  estimateSize: () => 33,
  overscan: 5,
})

<tbody
  style={{
    height: `${rowVirtualizer.getTotalSize()}px`,
    position: 'relative',
  }}
>
  {rowVirtualizer.getVirtualItems().map(virtualRow => {
    const row = rows[virtualRow.index]

    return (
      <tr
        key={row.id}
        style={{
          position: 'absolute',
          transform: `translateY(${virtualRow.start}px)`,
          width: '100%',
        }}
      >
        {row.getVisibleCells().map(cell => (
          <td key={cell.id}>{/* render cell */}</td>
        ))}
      </tr>
    )
  })}
</tbody>
```

### Virtualized Rows

The virtualized rows examples show how to render large row counts while keeping the DOM small. The examples are available for React, Solid, Svelte, Vue, Angular, and Lit. There is no Preact port yet, but the React example translates almost directly to Preact.

The core idea is that sorting, filtering, grouping, and other row-model work still comes from TanStack Table. The virtualizer reads from the final table row model:

```tsx
const rows = table.getRowModel().rows
```

The row virtualizer is configured with `count: rows.length`, a row height estimate, the scroll container, and an overscan value. The `tbody` is given the full virtual height with `rowVirtualizer.getTotalSize()`, while each rendered row is absolutely positioned with `transform: translateY(...)`.

The examples render cells from the current row with APIs like `row.getVisibleCells()` or `row.getAllCells()`, depending on whether the example needs visibility-aware cells or all cells.

The official examples use large generated datasets, commonly tens or hundreds of thousands of rows. They also support dynamic row heights by using `measureElement` when possible. The examples skip dynamic row measurement in Firefox because Firefox can measure table border height differently.

### Virtualized Columns

The virtualized columns examples show how to render large row and column counts. The examples are available for React, Solid, Svelte, Vue, Angular, and Lit.

Column virtualization uses the current visible column list:

```tsx
const visibleColumns = table.getVisibleLeafColumns()
```

The column virtualizer is configured for horizontal virtualization:

```tsx
const columnVirtualizer = useVirtualizer({
  count: visibleColumns.length,
  estimateSize: index => visibleColumns[index].getSize(),
  getScrollElement: () => tableContainerRef.current,
  horizontal: true,
  overscan: 3,
})
```

Column virtualization uses a different rendering strategy than row virtualization. Instead of absolutely positioning columns, the examples add fake spacer cells to the left and right:

```tsx
const virtualColumns = columnVirtualizer.getVirtualItems()
const virtualPaddingLeft = virtualColumns[0]?.start ?? 0
const virtualPaddingRight =
  columnVirtualizer.getTotalSize() -
  (virtualColumns[virtualColumns.length - 1]?.end ?? 0)
```

Those spacer cells preserve the horizontal scroll width while the renderer only mounts the virtual columns. This approach keeps row rendering table-like and allows dynamic row height measurement to keep working.

### Virtualized Rows And Columns Together

The official virtualized columns examples also virtualize rows. In those examples:

- The row virtualizer controls vertical positioning and total body height.
- The column virtualizer controls horizontal header/cell rendering and left/right spacer cells.
- `virtualRow.index` maps to `rows[virtualRow.index]`.
- `virtualColumn.index` maps to `visibleCells[virtualColumn.index]`.

Always use virtual indexes against the same current row and column lists returned by the table. If sorting, filtering, pagination, grouping, or column visibility changes, recompute the virtualized rows and columns from the current table state.

### Virtualized Infinite Scrolling

The virtualized infinite scrolling examples combine row virtualization with progressive data fetching. The examples are available for React, Solid, Svelte, Vue, Angular, and Lit.

The common pattern is:

1. Fetch a page of rows.
2. Flatten fetched pages into the table `data`.
3. Use row virtualization over the loaded rows.
4. Listen to scroll events on the table container.
5. Fetch the next page when the user scrolls near the bottom.

The Preact infinite scrolling pattern can use TanStack Query or any other data-fetching layer.

```tsx
const { scrollHeight, scrollTop, clientHeight } = scrollElement

if (scrollHeight - scrollTop - clientHeight < 500) {
  fetchNextPage()
}
```

If sorting is handled by the server, use manual sorting so the fetched data reflects the whole backend dataset rather than only the currently loaded rows. When sorting changes and the fetched dataset is replaced, scroll back to the top with `rowVirtualizer.scrollToIndex(0)`.

### Dynamic Row Heights

Dynamic row heights are useful when content can wrap or expand. They are also more complex than fixed-height rows.

Use `estimateSize` as the virtualizer's initial guess:

```tsx
estimateSize: () => 33
```

Then use `measureElement` to refine the actual row height after rendering:

```tsx
<tr
  data-index={virtualRow.index}
  ref={node => rowVirtualizer.measureElement(node)}
>
```

Set `data-index` on each row so the virtualizer can associate measurements with the correct item. Preact supports function refs on elements the same way React does, so this snippet works directly in Preact.

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
- Test production builds. Development builds can be slower than production builds; profile production bundles before optimizing.
- Prefer fixed row sizes when the UI allows it.
- For column virtualization, use `column.getSize()`, `header.getSize()`, and `cell.column.getSize()` consistently.

### Common Pitfalls

- Forgetting to give the scroll container a fixed height.
- Rendering `table.getRowModel().rows.map(...)` instead of `virtualizer.getVirtualItems().map(...)`.
- Using virtual indexes against stale rows or columns after sorting, filtering, pagination, grouping, or column visibility changes.
- Forgetting left and right spacer cells for horizontal virtualization.
- Using `measureElement` when every row has a fixed height.
- Expecting TanStack Table to provide virtualization APIs as a feature.
- Mixing client-side virtualization with server-side sorting or filtering inconsistently.

