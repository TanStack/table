# Preact Table with TanStack Virtual

Use this reference when virtualizing Preact table rows or columns. Virtual consumes the final Table model in the renderer; it is not a Table feature. For reactive model or subscription problems, read [table state](../../table-state/SKILL.md). Register `columnSizingFeature` before calling sizing APIs, and `columnVisibilityFeature` before visibility-aware APIs.

## Setup

```tsx
import { useRef } from 'preact/hooks'
import { useVirtualizer } from '@tanstack/react-virtual' // via preact/compat

const scrollRef = useRef<HTMLDivElement>(null)
const rows = table.getRowModel().rows
const virtualizer = useVirtualizer({
  count: rows.length,
  getScrollElement: () => scrollRef.current,
  estimateSize: () => 36,
  getItemKey: (index) => rows[index].id,
  overscan: 5,
})
```

Render a spacer of `getTotalSize()` and position each row from its virtual item's `start`.

## Core patterns

### Apply Table's column sizes

```tsx
<td style={{ width: cell.column.getSize() }}>
  <table.FlexRender cell={cell} />
</td>
```

### Measure dynamic rows by index

```tsx
<div key={row.id} data-index={item.index} ref={virtualizer.measureElement}>
  {row.id}
</div>
```

## Common mistakes

### HIGH Looking for a Preact-specific adapter

There is no `@tanstack/preact-virtual` package. In the standard Preact setup that aliases React to `preact/compat`, use the maintained React adapter:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'
```

If the application cannot use the compat alias, integrate the `Virtualizer` class from `@tanstack/virtual-core` directly. That is a lower-level integration with application-owned lifecycle and subscriptions; do not invent Preact hooks around it.

Source: `docs/framework/preact/guide/virtualization.md`

### HIGH Virtualizing raw data

Wrong:

```tsx
useVirtualizer({ count: data.length, getScrollElement, estimateSize })
```

Correct:

```tsx
const rows = table.getRowModel().rows
useVirtualizer({ count: rows.length, getScrollElement, estimateSize })
```

Raw data omits Table's current filtering, sorting, expansion, grouping, and pagination.

Source: `docs/framework/preact/guide/virtualization.md`

### HIGH Assuming layout is automatic

Wrong:

```tsx
virtualizer.getVirtualItems().map((item) => <div>{rows[item.index].id}</div>)
```

Correct:

```tsx
virtualizer
  .getVirtualItems()
  .map((item) => (
    <div
      style={{ position: 'absolute', transform: `translateY(${item.start}px)` }}
    >
      {rows[item.index].id}
    </div>
  ))
```

Virtual computes geometry; application markup and CSS must apply it and supply the scroll container/spacer.

Source: `docs/framework/preact/guide/virtualization.md`

## API discovery

Inspect `node_modules/@tanstack/preact-table/dist/index.d.ts`. For rendering APIs, inspect installed `node_modules/@tanstack/react-virtual/dist/` when using the standard `preact/compat` alias, or `node_modules/@tanstack/virtual-core/dist/` for a direct integration. There is no maintained Preact-specific Virtual package or Table example; start from the Preact guide and translate the maintained React examples only through the compat setup it describes.

## Sources

- `TanStack/table:docs/framework/preact/guide/virtualization.md`
- `TanStack/table:packages/preact-table/src/index.ts`
