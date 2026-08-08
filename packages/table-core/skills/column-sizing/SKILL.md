---
name: column-sizing
description: >
  Use columnSizingFeature numeric size, minSize, maxSize, getSize, getStart, getAfter, and total-size APIs in table, grid, or flex CSS. Load for auto or percentage misconceptions and sizing/pinning layout mismatch.
metadata:
  { type: sub-skill, library: '@tanstack/table-core', library_version: '9.1.1' }
requires: ['core', 'table-features']
sources:
  - 'TanStack/table:docs/framework/react/guide/column-sizing.md'
  - 'TanStack/table:packages/table-core/src/features/column-sizing'
  - 'TanStack/table:examples/react/column-sizing'
---

This skill builds on `core` and `table-features`. Sizing is numeric state; translating it to layout is a renderer decision.

## Setup

```ts
import { columnSizingFeature, tableFeatures } from '@tanstack/table-core'

export const features = tableFeatures({ columnSizingFeature })
export const defaultColumn = { size: 180, minSize: 80, maxSize: 480 }
```

## Core Patterns

```ts
cell.style.width = `${cell.column.getSize()}px`
tableElement.style.width = `${table.getTotalSize()}px`
```

Apply the same model sizes consistently to headers, cells, and pinned offsets.

## Common Mistakes

### [HIGH] Expecting state to style DOM

Wrong: `const options = { defaultColumn: { size: 180 } }`

Correct: `cell.style.width = `${cell.column.getSize()}px``

Numeric state does not apply CSS to headless markup.

Source: `docs/framework/react/guide/column-sizing.md#column-size-apis`

### [HIGH] Passing CSS sizes into numeric APIs

Wrong: `const column = { size: '25%' }`

Correct: `const column = { size: 240 }`

Table sizing state is numeric; percentages and auto layout belong in renderer CSS.

Source: `packages/table-core/src/features/column-sizing/columnSizingFeature.types.ts`

### [HIGH] Letting content override offsets

Wrong: `cell.style.minWidth = 'max-content'`

Correct: `cell.style.width = `${column.getSize()}px`; cell.style.overflow = 'hidden'`

If rendered width differs from the model, totals and pinning offsets no longer match geometry.

Source: `examples/react/column-sizing/src/main.tsx`

## API Discovery

Inspect `node_modules/@tanstack/table-core/dist/features/column-sizing/` for defaults and region-aware offset signatures.
