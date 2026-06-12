---
title: Virtualization (React) Guide
---

## Examples

Want to skip to the implementation? Check out these React examples:

- [Virtualized Columns](../examples/virtualized-columns)
- [Virtualized Rows](../examples/virtualized-rows)
- [Virtualized Infinite Scrolling](../examples/virtualized-infinite-scrolling)
- [Virtualized Columns Experimental](../examples/virtualized-columns-experimental)
- [Virtualized Rows Experimental](../examples/virtualized-rows-experimental)

### React Setup

Install and import the React virtualizer adapter from `@tanstack/react-virtual`. TanStack Table still owns rows, columns, and table state; the virtualizer owns scroll indexes and measurements.
Also see the [TanStack Virtual table example](https://tanstack.com/virtual/latest/docs/framework/react/examples/table).

## Virtualization (React) Guide

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

Install the React virtualizer adapter:

```sh
npm install @tanstack/react-virtual
```

The React examples use `useVirtualizer` from `@tanstack/react-virtual`. TanStack Table still owns rows, columns, headers, cells, sizing, sorting, filtering, and other table state; TanStack Virtual decides which item indexes should render for the current scroll position.

The table itself is set up like any other v9 table. Declare your features with `tableFeatures()` and create the table with `useTable`; nothing about virtualization changes the table setup.

```tsx
import {
  columnSizingFeature,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'

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

The [virtualized rows examples](../examples/virtualized-rows) show how to render large row counts while keeping the DOM small. The examples are available for React, Solid, Svelte, Vue, Angular, and Lit.

The core idea is that sorting, filtering, grouping, and other row-model work still comes from TanStack Table. The virtualizer reads from the final table row model:

```tsx
const rows = table.getRowModel().rows
```

The row virtualizer is configured with `count: rows.length`, a row height estimate, the scroll container, and an overscan value. The `tbody` is given the full virtual height with `rowVirtualizer.getTotalSize()`, while each rendered row is absolutely positioned with `transform: translateY(...)`.

The examples render cells from the current row with APIs like `row.getVisibleCells()` or `row.getAllCells()`, depending on whether the example needs visibility-aware cells or all cells.

The official examples use large generated datasets, commonly tens or hundreds of thousands of rows. They also support dynamic row heights by using `measureElement` when possible. The examples skip dynamic row measurement in Firefox because Firefox can measure table border height differently.

### Virtualized Columns

The [virtualized columns examples](../examples/virtualized-columns) show how to render large row and column counts. The examples are available for React, Solid, Svelte, Vue, Angular, and Lit.

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

The [virtualized infinite scrolling examples](../examples/virtualized-infinite-scrolling) combine row virtualization with progressive data fetching. The examples are available for React, Solid, Svelte, Vue, Angular, and Lit.

The common pattern is:

1. Fetch a page of rows.
2. Flatten fetched pages into the table `data`.
3. Use row virtualization over the loaded rows.
4. Listen to scroll events on the table container.
5. Fetch the next page when the user scrolls near the bottom.

The React example uses TanStack Query's `useInfiniteQuery`, but the same pattern works with any data-fetching layer.

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

Set `data-index` on each row so the virtualizer can associate measurements with the correct item. In non-React adapters, call `measureElement` through the adapter-appropriate ref, action, directive, or controller.

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
- Test production builds. React development mode is slower, and the React examples call this out.
- Prefer fixed row sizes when the UI allows it.
- For column virtualization, use `column.getSize()`, `header.getSize()`, and `cell.column.getSize()` consistently.

### Experimental React Virtualization Examples

The React examples include [Virtualized Rows Experimental](../examples/virtualized-rows-experimental) and [Virtualized Columns Experimental](../examples/virtualized-columns-experimental). These examples are advanced experiments for reducing React render work during scroll.

Use the standard examples first. Reach for the experimental examples only after profiling shows that React render work during scroll is the bottleneck.

The experimental examples use TanStack Virtual's `onChange` callback to imperatively update DOM styles instead of passing every scroll-position change through React render.

The experimental row example:

- Keeps a `rowRefsMap` from virtual row index to DOM row element.
- Uses `onChange` to update `rowRef.style.transform`.
- Memoizes rows with a custom `React.memo` comparator while scrolling.

```tsx
onChange: instance => {
  instance.getVirtualItems().forEach(virtualRow => {
    const rowRef = rowRefsMap.current.get(virtualRow.index)
    if (!rowRef) return
    rowRef.style.transform = `translateY(${virtualRow.start}px)`
  })
}
```

The experimental column example also mutates scroll-position-only DOM styles:

```tsx
tableContainerRef.current?.style.setProperty(
  '--virtual-padding-left',
  `${virtualPaddingLeft}px`,
)

tableContainerRef.current?.style.setProperty(
  '--virtual-padding-right',
  `${virtualPaddingRight}px`,
)

tableBodyRef.current!.style.height = `${instance.getTotalSize()}px`
```

It updates row transforms through DOM refs and memoizes header and cell components while the column virtualizer is scrolling.

Because these examples update the DOM outside React's normal render flow, keep the imperative updates narrowly scoped to scroll-position-only styles like `transform`, body height, and spacer widths. Do not use this pattern for business state, table state, data, sorting, filtering, or cell values.

### Choosing An Example

| Need | Start with |
| --- | --- |
| Many rows, normal columns | [Virtualized Rows](../examples/virtualized-rows) |
| Many columns | [Virtualized Columns](../examples/virtualized-columns) |
| Many rows and columns | [Virtualized Columns](../examples/virtualized-columns) |
| Remote data loaded as the user scrolls | [Virtualized Infinite Scrolling](../examples/virtualized-infinite-scrolling) |
| React scroll performance after profiling | [Experimental React examples](../examples/virtualized-rows-experimental) |

### Common Pitfalls

- Forgetting to give the scroll container a fixed height.
- Rendering `table.getRowModel().rows.map(...)` instead of `virtualizer.getVirtualItems().map(...)`.
- Using virtual indexes against stale rows or columns after sorting, filtering, pagination, grouping, or column visibility changes.
- Forgetting left and right spacer cells for horizontal virtualization.
- Using `measureElement` when every row has a fixed height.
- Expecting TanStack Table to provide virtualization APIs as a feature.
- Mixing client-side virtualization with server-side sorting or filtering inconsistently.
