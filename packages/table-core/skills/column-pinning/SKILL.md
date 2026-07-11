---
name: column-pinning
description: >
  Pin columns into logical start, center, and end regions with columnPinningFeature and renderer-owned sticky CSS. Load for RTL offsets, z-index, backgrounds, overflow, widths, gaps, or overlaps.
metadata:
  {
    type: sub-skill,
    library: '@tanstack/table-core',
    library_version: '9.0.0-beta.38',
  }
requires: ['core', 'table-features', 'column-sizing']
sources:
  - 'TanStack/table:docs/framework/react/guide/column-pinning.md'
  - 'TanStack/table:packages/table-core/src/features/column-pinning'
  - 'TanStack/table:examples/react/column-pinning-sticky'
---

This skill builds on `core`, `table-features`, and `column-sizing`. Pinning partitions models; CSS creates the sticky visual result.

## Setup

```ts
import {
  columnPinningFeature,
  columnSizingFeature,
  tableFeatures,
} from '@tanstack/table-core'

export const features = tableFeatures({
  columnSizingFeature,
  columnPinningFeature,
})
export const initialState = {
  columnPinning: { start: ['name'], end: ['actions'] },
}
```

## Core Patterns

```ts
const style = (column: Column<any, any>) => ({
  position: column.getIsPinned() ? 'sticky' : 'relative',
  insetInlineStart:
    column.getIsPinned() === 'start'
      ? `${column.getStart('start')}px`
      : undefined,
  insetInlineEnd:
    column.getIsPinned() === 'end' ? `${column.getAfter('end')}px` : undefined,
  width: `${column.getSize()}px`,
  zIndex: column.getIsPinned() ? 1 : 0,
  background: 'Canvas',
})
```

## Common Mistakes

### [HIGH] Using physical v8 regions

Wrong: `column.pin('left')`

Correct: `column.pin('start')`

V9 uses logical `start` and `end`, including state and collection APIs.

Source: `docs/framework/react/guide/migrating.md#column-pinning`

### [HIGH] Expecting sticky CSS automatically

Wrong: `column.pin('start')`

Correct: `Object.assign(cell.style, style(column))`

The feature only computes regions and offsets; the renderer owns positioning, backgrounds, overflow, and stacking.

Source: `examples/react/column-pinning-sticky/src/main.tsx`

### [HIGH] Diverging rendered and model widths

Wrong: `cell.style.width = 'auto'`

Correct: `cell.style.width = `${column.getSize()}px``

Sticky offsets use numeric sizes, so mismatched DOM widths create gaps or overlaps.

Source: `docs/framework/react/guide/column-pinning.md#useful-column-pinning-apis`

## API Discovery

Inspect `node_modules/@tanstack/table-core/src/features/column-pinning/`; use CSS logical properties for direction-aware rendering.
