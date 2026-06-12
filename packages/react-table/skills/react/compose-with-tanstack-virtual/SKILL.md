---
name: react/compose-with-tanstack-virtual
description: >
  `@tanstack/react-table` v9 does NOT include virtualization — pair with
  `@tanstack/react-virtual`. Standard row-virtualization pattern: get the row
  array from `table.getRowModel().rows`, feed `rows.length` to
  `useVirtualizer({ count, estimateSize, getScrollElement, ... })` in the
  DEEPEST possible component (a `TableBody`, NOT `App`), iterate
  `rowVirtualizer.getVirtualItems()` instead of `rows.map`, absolute-position
  each row with `transform: translateY(virtualRow.start)px`, and render
  `<tbody>` as a CSS grid with a fixed total height. Column virtualization
  uses `horizontal: true` plus padding-left/right placeholder cells. An
  experimental ref-mutation variant skips React reconciliation for ~10%
  extra perf but the standard pattern is the default.
type: composition
library: tanstack-table
framework: react
library_version: '9.0.0-alpha.48'
requires:
  - react/table-state
  - row-expanding
sources:
  - TanStack/table:docs/guide/virtualization.md
  - TanStack/table:examples/react/virtualized-rows/src/main.tsx
  - TanStack/table:examples/react/virtualized-columns/src/main.tsx
  - TanStack/table:examples/react/virtualized-infinite-scrolling/src/main.tsx
  - TanStack/table:examples/react/virtualized-rows-experimental/src/main.tsx
---

This skill builds on `tanstack-table/state-management` and `tanstack-table/react/table-state`. Read those first — the table's row model is what feeds the virtualizer.

## Why this skill exists

TanStack Table renders every row in its `getRowModel().rows` array. For 50 rows that's fine; for 50k or 500k it crashes the browser. `@tanstack/react-virtual` only renders the rows that fit inside the scroll container, recycling DOM nodes as the user scrolls.

## Setup

```bash
pnpm add @tanstack/react-table @tanstack/react-virtual
```

The two pieces:

```tsx
import { useTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
```

## Core Pattern — row virtualization (standard)

The single most important rule: **keep `useVirtualizer` in the deepest component possible.** Any state change in the component that owns the virtualizer re-runs it, blowing away scroll position and measurement cache.

```tsx
import * as React from 'react'
import {
  useTable,
  tableFeatures,
  columnSizingFeature,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
  createColumnHelper,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { ReactTable, Row } from '@tanstack/react-table'
import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual'

const features = tableFeatures({
  columnSizingFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('id', { header: 'ID', size: 60 }),
  columnHelper.accessor('firstName', { cell: (info) => info.getValue() }),
  columnHelper.accessor('lastName', {
    id: 'lastName',
    cell: (info) => info.getValue(),
  }),
])

function App() {
  // 1) Scroll container ref + table at App level.
  const tableContainerRef = React.useRef<HTMLDivElement>(null)
  const [data] = React.useState(() => makeData(200_000))

  const table = useTable({
    features,
    columns,
    data,
  })

  return (
    <div
      ref={tableContainerRef}
      style={{ overflow: 'auto', position: 'relative', height: 800 }}
    >
      {/* 2) display: grid — required for absolute positioning + dynamic heights */}
      <table style={{ display: 'grid' }}>
        <thead
          style={{
            display: 'grid',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            height: 34,
          }}
        >
          {table.getHeaderGroups().map((hg) => (
            <tr
              key={hg.id}
              style={{ display: 'flex', height: 34, width: '100%' }}
            >
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: h.getSize(),
                  }}
                >
                  <div onClick={h.column.getToggleSortingHandler()}>
                    <table.FlexRender header={h} />
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {/* 3) Virtualizer lives inside TableBody, NOT here. */}
        <TableBody table={table} tableContainerRef={tableContainerRef} />
      </table>
    </div>
  )
}

interface TableBodyProps {
  table: ReactTable<typeof features, Person>
  tableContainerRef: React.RefObject<HTMLDivElement | null>
}

function TableBody({ table, tableContainerRef }: TableBodyProps) {
  const { rows } = table.getRowModel()

  // 4) useVirtualizer in the deepest body component.
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 33,
    getScrollElement: () => tableContainerRef.current,
    // 5) Skip dynamic measurement on Firefox — it measures border height wrong.
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (el) => el.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })

  return (
    <tbody
      style={{
        display: 'grid',
        height: `${rowVirtualizer.getTotalSize()}px`, // total scrollable height
        position: 'relative', // for absolute child rows
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index]
        return (
          <tr
            key={row.id}
            data-index={virtualRow.index}
            ref={(node) => rowVirtualizer.measureElement(node)}
            style={{
              display: 'flex',
              position: 'absolute',
              transform: `translateY(${virtualRow.start}px)`,
              width: '100%',
            }}
          >
            {row.getAllCells().map((cell) => (
              <td
                key={cell.id}
                style={{ display: 'flex', width: cell.column.getSize() }}
              >
                <table.FlexRender cell={cell} />
              </td>
            ))}
          </tr>
        )
      })}
    </tbody>
  )
}
```

Source: `examples/react/virtualized-rows/src/main.tsx`.

## Column virtualization and infinite scroll

Column virtualization (`horizontal: true` + placeholder padding cells) and infinite scroll via `useInfiniteQuery` + `manualSorting: true` — see [column-virtualization-and-infinite-scroll.md](references/column-virtualization-and-infinite-scroll.md). That file also covers the HIGH-priority `manualSorting` failure mode and the column-virt padding-cells failure mode.

## Experimental ref-mutation variant

`examples/react/virtualized-rows-experimental/` and `virtualized-columns-experimental/` mutate row `style` directly via the virtualizer's `onChange` callback, skipping React reconciliation on scroll. Roughly **10% rendering perf gain** in maintainer benchmarks. The pattern is valid but the standard pattern above is the documented default; reach for the experimental version only when measured perf demands it.

## Common Mistakes

### CRITICAL `useVirtualizer` in the same component as `useTable`

Wrong:

```tsx
function App() {
  const rowVirtualizer = useVirtualizer({
    /* … */
  }) // virtualizer too high
  const table = useTable(opts)
  return <TableBody table={table} virtualizer={rowVirtualizer} />
}
```

Correct:

```tsx
function App() {
  const tableContainerRef = React.useRef<HTMLDivElement>(null)
  const table = useTable(opts)
  return (
    <div ref={tableContainerRef}>
      <TableBody table={table} tableContainerRef={tableContainerRef} />
    </div>
  )
}
function TableBody({ table, tableContainerRef }) {
  const rowVirtualizer = useVirtualizer({
    /* … */
  }) // virtualizer deepest
  /* … */
}
```

Any state change in the component owning the virtualizer re-runs it — losing scroll position and remeasuring every row.
Source: `examples/react/virtualized-rows/src/main.tsx`.

### CRITICAL Rendering `rows.map` directly on a large dataset

Wrong:

```tsx
<tbody>
  {rows.map((row) => (
    <tr key={row.id}>...</tr>
  ))}
</tbody>
// 200k DOM rows — browser crashes.
```

Correct:

```tsx
<tbody
  style={{
    display: 'grid',
    height: `${rowVirtualizer.getTotalSize()}px`,
    position: 'relative',
  }}
>
  {rowVirtualizer.getVirtualItems().map((vr) => {
    const row = rows[vr.index]
    return (
      <tr
        style={{
          position: 'absolute',
          transform: `translateY(${vr.start}px)` /* … */,
        }}
      >
        {/* … */}
      </tr>
    )
  })}
</tbody>
```

Use `getVirtualItems()` so only the visible window renders.
Source: `examples/react/virtualized-rows/src/main.tsx`.

### CRITICAL Missing `display: grid` + absolute positioning

Wrong:

```tsx
<tbody>
  {rowVirtualizer.getVirtualItems().map((vr) => (
    <tr key={vr.key}>{/* no transform, no absolute */}</tr>
  ))}
</tbody>
```

Correct:

```tsx
<tbody
  style={{
    display: 'grid',
    height: `${rowVirtualizer.getTotalSize()}px`,
    position: 'relative',
  }}
>
  {rowVirtualizer.getVirtualItems().map((vr) => (
    <tr
      style={{
        display: 'flex',
        position: 'absolute',
        transform: `translateY(${vr.start}px)`,
        width: '100%',
      }}
    >
      {/* … */}
    </tr>
  ))}
</tbody>
```

The semantic `<table>` layout collides with absolute positioning. CSS grid lets the rows position themselves freely while keeping semantic tags. Without `transform: translateY(start)px` all rows render at `top: 0`.
Source: `examples/react/virtualized-rows/src/main.tsx`.

### HIGH Using `measureElement` on Firefox

Wrong:

```tsx
const rowVirtualizer = useVirtualizer({
  count: rows.length,
  estimateSize: () => 33,
  getScrollElement: () => ref.current,
  measureElement: (el) => el.getBoundingClientRect().height, // jitters in Firefox
})
```

Correct:

```tsx
const rowVirtualizer = useVirtualizer({
  count: rows.length,
  estimateSize: () => 33,
  getScrollElement: () => ref.current,
  measureElement:
    typeof window !== 'undefined' &&
    navigator.userAgent.indexOf('Firefox') === -1
      ? (el) => el.getBoundingClientRect().height
      : undefined,
})
```

Firefox returns inconsistent row heights for table rows, causing flicker. Guard the option.
Source: `examples/react/virtualized-rows/src/main.tsx`.

### HIGH Storing the ref instead of using the callback-ref form

Wrong:

```tsx
const rowRef = React.useRef(null)
<tr ref={rowRef} /*…*/ />
// rowVirtualizer can't remeasure when row content changes height
```

Correct:

```tsx
<tr ref={(node) => rowVirtualizer.measureElement(node)} /*…*/ />
```

The pattern is a ref callback that calls `measureElement(node)` — passing a stored ref means the virtualizer never gets a chance to remeasure.
Source: `examples/react/virtualized-rows/src/main.tsx`.

For HIGH-priority failure modes specific to column virtualization (missing padding placeholders) and infinite scroll (`manualSorting` requirement), see [column-virtualization-and-infinite-scroll.md](references/column-virtualization-and-infinite-scroll.md).

## See Also

- `tanstack-table/react/production-readiness` — keep virtualizers in deepest components.
- `tanstack-table/react/compose-with-tanstack-query` — `useInfiniteQuery` integration.
- `tanstack-table/react/table-state` — the row model API the virtualizer reads from.

## References

- [column-virtualization-and-infinite-scroll.md](references/column-virtualization-and-infinite-scroll.md) — `horizontal: true` column virtualization with placeholder padding cells, `useInfiniteQuery` + `manualSorting: true` integration, plus HIGH-priority failure modes for both
