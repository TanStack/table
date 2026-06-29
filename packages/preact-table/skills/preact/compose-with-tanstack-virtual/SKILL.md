---
name: preact/compose-with-tanstack-virtual
description: >
  TanStack Table does NOT include virtualization — pair with TanStack Virtual.
  Preact has no dedicated `@tanstack/preact-virtual` adapter yet; use
  `@tanstack/virtual-core`'s `Virtualizer` class behind a small hook, or use
  the React adapter via `preact/compat`. Pattern: get `rows = table.getRowModel().rows`,
  feed `rows.length` to the virtualizer, render only virtual items, and use
  CSS transforms for row positioning. Routing keywords: preact virtualization,
  large table, virtual rows, virtual-core, getVirtualItems, table-core.
type: composition
library: tanstack-table
framework: preact
library_version: '9.0.0-alpha.48'
requires:
  - preact/table-state
  - row-expanding
sources:
  - TanStack/table:docs/guide/virtualization.md
  - TanStack/table:examples/lit/virtualized-rows/src/main.ts
  - TanStack/table:examples/react/virtualized-rows/
  - TanStack/table:examples/react/virtualized-columns/
---

TanStack Table is headless — it does not virtualize rows or columns. For long lists, pair the table with TanStack Virtual.

> **Adapter status:** There is no published `@tanstack/preact-virtual` adapter as of `@tanstack/table` v9.0.0-alpha.48. The two supported paths are:
>
> 1. **Use `@tanstack/virtual-core` directly.** The framework-agnostic `Virtualizer` class wrapped in a small Preact hook is the recommended path.
> 2. **Use `@tanstack/react-virtual` via `preact/compat`.** Works if your project already aliases `react` → `preact/compat`.
>
> The patterns below use path 1. Both paths feed the same `rows = table.getRowModel().rows` array to the virtualizer.

## Install

```bash
npm install @tanstack/virtual-core
```

## The Pattern (Row Virtualization)

1. Build the table with `useTable` as usual.
2. Get `const { rows } = table.getRowModel()` — the table is the source of truth for which rows to render (already sorted, filtered, paginated, etc.).
3. Pass `rows.length` to the virtualizer.
4. Render only `virtualizer.getVirtualItems()`.
5. Each virtual row is absolutely positioned via `transform: translateY(${item.start}px)`.

```tsx
import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import {
  Virtualizer,
  observeElementOffset,
  observeElementRect,
  elementScroll,
} from '@tanstack/virtual-core'
import {
  useTable,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/preact-table'
import type { JSX } from 'preact'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

// Minimal Preact hook around the framework-agnostic Virtualizer.
function useVirtualizer<TScrollEl extends Element, TItemEl extends Element>(
  options: Omit<
    ConstructorParameters<typeof Virtualizer<TScrollEl, TItemEl>>[0],
    'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
  > & { onChange?: (instance: Virtualizer<TScrollEl, TItemEl>) => void },
) {
  const [, force] = useState(0)
  const virtualizer = useMemo(
    () =>
      new Virtualizer<TScrollEl, TItemEl>({
        ...options,
        observeElementRect,
        observeElementOffset,
        scrollToFn: elementScroll,
        onChange: (inst) => {
          options.onChange?.(inst)
          force((n) => n + 1)
        },
      }),
    [],
  )

  // Sync count / estimateSize / overscan when they change.
  virtualizer.setOptions({
    ...virtualizer.options,
    count: options.count,
    estimateSize: options.estimateSize,
    overscan: options.overscan,
  })

  useEffect(() => {
    return virtualizer._didMount()
  }, [virtualizer])

  useEffect(() => {
    virtualizer._willUpdate()
  })

  return virtualizer
}

function BigTable({ data }) {
  const table = useTable(
    {
      features,
      columns,
      data,
    },
    () => null, // huge table — opt out at the top, subscribe lower down
  )

  const { rows } = table.getRowModel()

  const scrollRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current!,
    estimateSize: () => 33,
    overscan: 5,
  })

  return (
    <div
      ref={scrollRef}
      style={{ overflow: 'auto', height: 800, position: 'relative' }}
    >
      <table style={{ display: 'grid' }}>
        <thead
          style={{ display: 'grid', position: 'sticky', top: 0, zIndex: 1 }}
        >
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} style={{ display: 'flex', width: '100%' }}>
              {hg.headers.map((h) => (
                <th key={h.id} style={{ display: 'flex', width: h.getSize() }}>
                  <table.FlexRender header={h} />
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody
          style={{
            display: 'grid',
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const row = rows[virtualItem.index]
            return (
              <tr
                key={row.id}
                ref={(node) => rowVirtualizer.measureElement(node!)}
                data-index={virtualItem.index}
                style={{
                  display: 'flex',
                  position: 'absolute',
                  transform: `translateY(${virtualItem.start}px)`,
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
      </table>
    </div>
  )
}
```

The structure matches the Lit virtualized-rows example one-for-one; only the host framework changes.
Source: `examples/lit/virtualized-rows/src/main.ts`; `docs/guide/virtualization.md`.

## Column Virtualization

Same idea, but the virtualizer's `count` is `columns.length` and you index the visible columns inside each row. Useful for wide kitchen-sink tables.

## With Pagination / Filtering

Use the row model that's already been transformed by registered features. The virtualizer count is `rows.length` — the table handles sorting, filtering, and pagination upstream.

## Combining with `<table.Subscribe>`

On large tables, pass `() => null` to `useTable` (or use the standalone `<Subscribe>`) and wrap the `<tbody>` in a subscription that re-renders only when the row model can actually change.

```tsx
<table.Subscribe
  selector={(s) => ({
    columnFilters: s.columnFilters,
    globalFilter: s.globalFilter,
    sorting: s.sorting,
  })}
>
  {() => <tbody>{/* virtualized rows */}</tbody>}
</table.Subscribe>
```

Source: `examples/preact/basic-subscribe/src/main.tsx`.

## Common Mistakes

### CRITICAL Reimplementing virtualization by hand

Wrong:

```tsx
// Manual slicing + intersection observer + per-row offset calculation
```

Correct: use TanStack Virtual's `Virtualizer` — it handles measurement, overscan, scroll alignment, and dynamic sizing.
Source: `docs/guide/virtualization.md`.

### HIGH Using the wrong row source

Wrong:

```tsx
const virtualizer = useVirtualizer({ count: data.length /* … */ }) // bypasses sort/filter/paginate
```

Correct:

```tsx
const { rows } = table.getRowModel()
const virtualizer = useVirtualizer({ count: rows.length /* … */ })
```

Always feed `table.getRowModel().rows.length` — that's the post-feature row array.

### HIGH Forgetting `position: relative` on the scroll parent / `position: absolute` on rows

Wrong:

```tsx
<div ref={scrollRef} style={{ overflow: 'auto', height: 800 }}>
  <tbody style={{ height: rowVirtualizer.getTotalSize() }}>{/* rows */}</tbody>
</div>
```

Correct: the absolute rows need a `position: relative` ancestor with the total height set. Without it, rows stack at the top.

### HIGH Forgetting to set up `measureElement` for dynamic sizing

Wrong: rows render but `estimateSize` is wrong and rows overlap or leave gaps.

Correct: attach `ref={(node) => rowVirtualizer.measureElement(node!)}` to each row element so the virtualizer can measure actual size.

### MEDIUM Mixing virtualization with `manualPagination`

You usually don't need both — server pagination already limits the row count. Virtualize when the client holds the full dataset.

## See Also

- `tanstack-table/preact/table-state` — Subscribe for fine-grained re-renders.
- `tanstack-table/preact/production-readiness` — narrow selectors, stable refs.
- `tanstack-table/row-expanding` — virtualizing rows with sub-component rows requires variable height + measureElement.
