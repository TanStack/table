---
name: solid/compose-with-tanstack-virtual
description: >
  Virtualize a `@tanstack/solid-table` with `@tanstack/solid-virtual`'s
  `createVirtualizer`. Take rows from `table.getRowModel().rows`, feed
  `() => rows().length` as a reactive `count`, render only the visible rows
  inside `<tbody>` with absolute positioning + a `translateY` per row. Keep
  the virtualizer in the same component as the scroll container ref.
type: composition
library: tanstack-table
framework: solid
library_version: '9.0.0-alpha.48'
requires:
  - solid/table-state
  - row-expanding
sources:
  - docs/guide/virtualization.md
  - examples/solid/virtualized-rows/src/App.tsx
  - examples/solid/virtualized-columns/
  - examples/solid/virtualized-infinite-scrolling/
---

# Compose with `@tanstack/solid-virtual`

TanStack Table does **not** include virtualization. For >>visible-row datasets,
pair with `@tanstack/solid-virtual`'s `createVirtualizer`. The table still
manages every row model (sort, filter, group, expand); the virtualizer only
decides which rows to **paint**.

## Install

```bash
pnpm add @tanstack/solid-virtual
```

## Reference pattern (dynamic row height)

```tsx
import {
  createTable,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
  columnSizingFeature,
  tableFeatures,
  FlexRender,
  type Row,
  type SolidTable,
} from '@tanstack/solid-table'
import {
  createVirtualizer,
  type VirtualItem,
  type Virtualizer,
} from '@tanstack/solid-virtual'
import { For, createSignal } from 'solid-js'

const features = tableFeatures({
  columnSizingFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

function App() {
  const [data] = createSignal(makeData(200_000))

  const table = createTable({
    features,
    columns,
    get data() {
      return data()
    },
  })

  return <VirtualizedTable table={table} />
}

// Keep the virtualizer + scroll container ref in the SAME component.
function VirtualizedTable(props: {
  table: SolidTable<typeof features, Person>
}) {
  let tableContainerRef: HTMLDivElement | undefined

  const rows = () => props.table.getRowModel().rows

  const rowVirtualizer = createVirtualizer<HTMLDivElement, HTMLTableRowElement>(
    {
      get count() {
        return rows().length
      },
      estimateSize: () => 33,
      getScrollElement: () => tableContainerRef ?? null,
      // Optional: measure for dynamic row height
      measureElement:
        typeof window !== 'undefined' &&
        navigator.userAgent.indexOf('Firefox') === -1
          ? (el) => el.getBoundingClientRect().height
          : undefined,
      overscan: 5,
    },
  )

  return (
    <div
      ref={tableContainerRef}
      style={{ overflow: 'auto', position: 'relative', height: '800px' }}
    >
      <table style={{ display: 'grid' }}>
        <thead
          style={{
            display: 'grid',
            position: 'sticky',
            top: '0px',
            'z-index': 1,
          }}
        >
          <For each={props.table.getHeaderGroups()}>
            {(hg) => (
              <tr style={{ display: 'flex', width: '100%' }}>
                <For each={hg.headers}>
                  {(header) => (
                    <th
                      style={{
                        display: 'flex',
                        width: `${header.getSize()}px`,
                      }}
                    >
                      <FlexRender header={header} />
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody
          style={{
            display: 'grid',
            height: `${rowVirtualizer.getTotalSize()}px`, // tells the scrollbar how tall
            position: 'relative',
          }}
        >
          <For each={rowVirtualizer.getVirtualItems()}>
            {(virtualRow) => (
              <TableBodyRow
                row={rows()[virtualRow.index]}
                virtualRow={virtualRow}
                rowVirtualizer={rowVirtualizer}
                table={props.table}
              />
            )}
          </For>
        </tbody>
      </table>
    </div>
  )
}

function TableBodyRow(props: {
  row: Row<typeof features, Person>
  virtualRow: VirtualItem
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>
  table: SolidTable<typeof features, Person>
}) {
  return (
    <tr
      data-index={props.virtualRow.index}
      ref={(node) => props.rowVirtualizer.measureElement(node)}
      style={{
        display: 'flex',
        position: 'absolute',
        transform: `translateY(${props.virtualRow.start}px)`,
        width: '100%',
      }}
    >
      <For each={props.row.getAllCells()}>
        {(cell) => (
          <td style={{ display: 'flex', width: `${cell.column.getSize()}px` }}>
            <FlexRender cell={cell} />
          </td>
        )}
      </For>
    </tr>
  )
}
```

## Why the structure looks like this

- **`display: grid` / `display: flex` on `table`/`thead`/`tbody`/`tr`.** A
  classic semantic `<table>` cannot do absolute-positioned rows. CSS grid +
  flex preserves the tag tree while letting the browser absolutely position
  rows inside the body.
- **`height: rowVirtualizer.getTotalSize()` on `<tbody>`.** Makes the
  scrollbar correctly sized for the **virtual** dataset, not just the painted
  rows.
- **`translateY(virtualRow.start)` per row.** Each rendered row jumps to its
  virtual position.
- **`ref={(node) => rowVirtualizer.measureElement(node)}`** on each row.
  Required for dynamic heights. If your rows are fixed-height, you can drop
  `measureElement` and the ref.

## Reactive `count` is critical

```tsx
// ❌ Captures length once
createVirtualizer({ count: rows().length /* ... */ })

// ✅ Reactive — virtualizer re-derives when rows() changes
createVirtualizer({
  get count() {
    return rows().length
  } /* ... */,
})
```

Same applies to `getScrollElement: () => tableContainerRef ?? null` (function),
not `getScrollElement: tableContainerRef` (snapshot).

## Component scoping

Keep `createVirtualizer` in the lowest component that owns the scroll
container. Putting it high in the tree means every scroll event recomputes
ancestor components.

The example pulls `TableBodyRow` out into its own component for the same
reason — narrow re-render boundary.

## Virtualized columns

Same idea for wide tables: virtualize across `table.getVisibleLeafColumns()`.
See `examples/solid/virtualized-columns/`. The pattern is identical:
`count = columns.length`, `estimateSize = (i) => columns[i].getSize()`,
position cells with `translateX`.

## Combining with `row-expanding`

When `rowExpandingFeature` is registered and a row has subrows, the row count
the virtualizer sees is the **flattened** count
(`table.getRowModel().rows.length`, which already includes expanded subrows).
You don't need to compute that manually.

For variable subrow heights, keep `measureElement` so the virtualizer
remeasures after expand/collapse.

## Failure modes

### CRITICAL — virtualizer scoped above the scroll container

If `createVirtualizer` lives in a parent component, the ref-as-`undefined`
trick in the example only works because Solid evaluates the ref binding before
the JSX returns. Moving it up breaks that. Keep them together.

### CRITICAL — `count` not reactive

`count: rows().length` reads once. Use `get count() { return rows().length }`.
Same for `getScrollElement` — it must be a function.

### HIGH — missing `height: rowVirtualizer.getTotalSize()` on `<tbody>`

Without it, the scrollbar is sized only for the painted rows. User scrolls
once and hits the bottom of "the table" even though 99% of rows are off-screen.

### HIGH — virtualized rows with `display: table-row`

A semantic `<tr>` with `display: table-row` cannot be absolutely positioned.
Use `display: flex` on `<tr>` and `display: grid` on `<tbody>` (as shown).

### MEDIUM — `measureElement` left enabled in Firefox

Firefox measures table border heights incorrectly. The example guards this
with a userAgent check — keep that guard for cross-browser correctness.

### MEDIUM — over-eager `overscan`

Default `overscan` of 5 is usually fine. Cranking it to 50 paints more rows
than necessary; cranking it to 0 causes blank flashes at scroll boundaries.

### MEDIUM — reading `table.state()` inside the virtualized row

Each painted row that calls `table.state()` subscribes to the selected state.
If your row only needs `column.getSize()` and `cell.getValue()`, don't read
state at all — they are already tracking their own atoms.

### LOW — column sizing without `columnSizingFeature` registered

The example uses `header.getSize()` and `cell.column.getSize()`, which require
`columnSizingFeature` in `features`. Without it those APIs are missing.
