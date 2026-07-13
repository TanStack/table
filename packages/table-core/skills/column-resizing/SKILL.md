---
name: column-resizing
description: >
  Wire columnResizingFeature, header.getResizeHandler, resize mode and direction, pointer or touch events, and performant CSS-variable updates. Load when resize state changes but widths do not, or large tables resize slowly.
metadata:
  {
    type: sub-skill,
    library: '@tanstack/table-core',
    library_version: '9.0.0-beta.47',
  }
requires: ['core', 'table-features', 'column-sizing']
sources:
  - 'TanStack/table:docs/framework/react/guide/column-resizing.md'
  - 'TanStack/table:packages/table-core/src/features/column-resizing'
  - 'TanStack/table:examples/react/column-resizing-performant'
---

This skill builds on `core`, `table-features`, and `column-sizing`. Resizing supplies gesture APIs and state; the renderer supplies handles and widths.

## Setup

```ts
import {
  columnResizingFeature,
  columnSizingFeature,
  tableFeatures,
} from '@tanstack/table-core'

export const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
})
export const options = {
  columnResizeMode: 'onChange' as const,
  columnResizeDirection: 'ltr' as const,
}
```

## Core Patterns

```ts
const handler = header.getResizeHandler()
handle.addEventListener('mousedown', handler)
handle.addEventListener('touchstart', handler)
```

For large grids, compute all visible sizes once per update and expose them as CSS variables.

## Common Mistakes

### [CRITICAL] Omitting sizing prerequisite

Wrong: `tableFeatures({ columnResizingFeature })`

Correct: `tableFeatures({ columnSizingFeature, columnResizingFeature })`

Resizing modifies the sizing state and requires `columnSizingFeature`.

Source: `packages/table-core/src/types/TableFeatures.ts#FeatureSlotPrereqs`

### [HIGH] Rendering an inert handle

Wrong: `handle.addEventListener('pointerdown', header.getResizeHandler())`

Correct:

```ts
const handler = header.getResizeHandler()
handle.addEventListener('mousedown', handler)
handle.addEventListener('touchstart', handler)
```

The shipped handler distinguishes `touchstart` from the mouse path. A single
`pointerdown` listener does not provide working touch resizing; wire both mouse
and touch start events.

Source: `docs/framework/react/guide/column-resizing.md#connect-column-resizing-apis-to-ui`

### [MEDIUM] Reading sizes in every cell

Wrong: `cells.forEach(cell => cell.style.width = `${cell.column.getSize()}px`)`

Correct: `root.style.setProperty(`--col-${header.id}`, `${header.getSize()}px`)`

Caching sizes or CSS variables avoids repeated work during `onChange` resizing.

Source: `examples/react/column-resizing-performant/src/main.tsx`

## API Discovery

Inspect `node_modules/@tanstack/table-core/src/features/column-resizing/` and the sizing feature directory for the state it updates.
