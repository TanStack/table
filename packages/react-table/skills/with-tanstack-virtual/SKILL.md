---
name: with-tanstack-virtual
description: >
  Virtualize final React Table row or column models with TanStack Virtual. Load for useVirtualizer counts, scroll elements, stable keys, data-index measurement, dynamic heights, sticky headers/columns, grid/flex geometry, or infinite fetching; Virtual is renderer composition, not a Table feature.
metadata:
  type: composition
  library: '@tanstack/react-table'
  library_version: '9.0.0-beta.78'
  framework: react
requires:
  - '@tanstack/table-core#core'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:docs/framework/react/guide/virtualization.md'
  - 'TanStack/table:examples/react/virtualized-rows'
  - 'TanStack/table:examples/react/virtualized-columns'
  - 'TanStack/table:examples/react/virtualized-infinite-scrolling'
---

This skill builds on `@tanstack/table-core#core`, `getting-started`, and `table-state`. Build the Table model first, then virtualize its final rendered rows or visible columns.

## Setup

```tsx
import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualBody({ table }: { table: any }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const rows = table.getRowModel().rows
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 36,
    getItemKey: (index) => rows[index].id,
    overscan: 5,
  })
  return (
    <div ref={scrollRef} style={{ height: 400, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={rows[item.index].id}
            data-index={item.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              transform: `translateY(${item.start}px)`,
              width: '100%',
            }}
          >
            {rows[item.index].getAllCells().map((cell: any) => (
              <span
                key={cell.id}
                style={{
                  display: 'inline-block',
                  width: cell.column.getSize(),
                }}
              >
                <table.FlexRender cell={cell} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Core Patterns

### Keep the virtualizer near its render loop

```tsx
const rows = table.getRowModel().rows
const rowVirtualizer = useVirtualizer({
  count: rows.length,
  getScrollElement: () => container.current,
  estimateSize: () => 36,
})
```

This limits unrelated parent updates and keeps count, measurement, and rendered items together.

### Use Table sizes in renderer CSS

```tsx
<td style={{ width: cell.column.getSize() }}>
  <table.FlexRender cell={cell} />
</td>
```

Table calculates size state; the renderer must apply it.

## Common Mistakes

### HIGH Registering Virtual as a feature

Wrong:

```tsx
const features = tableFeatures({ rowVirtualizer: useVirtualizer(options) })
```

Correct:

```tsx
const rows = table.getRowModel().rows
const virtualizer = useVirtualizer({
  count: rows.length,
  getScrollElement: () => scrollRef.current,
  estimateSize: () => 36,
})
```

Virtual controls rendering geometry and is not a Table feature or row model.

Source: `docs/framework/react/guide/virtualization.md`

### HIGH Virtualizing raw input data

Wrong:

```tsx
const virtualizer = useVirtualizer({
  count: data.length,
  getScrollElement,
  estimateSize,
})
```

Correct:

```tsx
const rows = table.getRowModel().rows
const virtualizer = useVirtualizer({
  count: rows.length,
  getScrollElement,
  estimateSize,
})
```

Raw data ignores filtering, sorting, expansion, grouping, and pagination already applied by Table.

Source: `examples/react/virtualized-rows`

### HIGH Measuring against incomplete identity

Wrong:

```tsx
<tr ref={virtualizer.measureElement}>{row.id}</tr>
```

Correct:

```tsx
<tr key={row.id} data-index={item.index} ref={virtualizer.measureElement}>
  {row.id}
</tr>
```

Dynamic measurement needs the virtual index, and stable row identity prevents measurements moving to the wrong row.

Source: `examples/react/virtualized-rows`

### HIGH Omitting positioning geometry

Wrong:

```tsx
<tbody>{virtualizer.getVirtualItems().map(renderRow)}</tbody>
```

Correct:

```tsx
<tbody
  style={{
    display: 'grid',
    height: virtualizer.getTotalSize(),
    position: 'relative',
  }}
>
  {virtualizer.getVirtualItems().map(renderRow)}
</tbody>
```

Virtual only computes positions; the renderer must provide total spacer size and position items using each virtual start.

Source: `examples/react/virtualized-rows`

## API Discovery

Inspect `node_modules/@tanstack/react-table/dist/index.d.ts` for Table render APIs and installed `node_modules/@tanstack/react-virtual/dist/` for the exact virtualizer options. Copy layout contracts from the maintained example matching rows, columns, or infinite loading.
