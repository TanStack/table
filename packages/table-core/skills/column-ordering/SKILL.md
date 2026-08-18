---
name: column-ordering
description: >
  Control TanStack Table v9 leaf columnOrder with stable IDs while accounting for pinning regions, visibility, and groupedColumnMode precedence. Load for drag-and-drop columns or rendered order that differs from state.
metadata:
  {
    type: sub-skill,
    library: '@tanstack/table-core',
    library_version: '9.0.0-beta.80',
  }
requires: ['core', 'table-features']
sources:
  - 'TanStack/table:docs/framework/react/guide/column-ordering.md'
  - 'TanStack/table:packages/table-core/src/features/column-ordering'
  - 'TanStack/table:examples/react/column-dnd'
---

This skill builds on `core` and `table-features`. `columnOrder` orders unpinned leaf IDs; other plugins can still determine the final visual regions.

## Setup

```ts
import { columnOrderingFeature, tableFeatures } from '@tanstack/table-core'

export const features = tableFeatures({ columnOrderingFeature })
export const initialState = { columnOrder: ['name', 'age', 'actions'] }
```

## Core Patterns

```ts
const next = columnOrder.filter((id) => id !== activeId)
next.splice(next.indexOf(overId), 0, activeId)
table.setColumnOrder(next)
```

Use column IDs as drag identities and replace the array.

## Common Mistakes

### [HIGH] Assuming state is final order

Wrong: `renderIds(columnOrder)`

Correct: `renderColumns(table.getAllLeafColumns())`

Pinning regions and grouping mode apply after base ordering. If
`columnVisibilityFeature` is also registered, render
`table.getVisibleLeafColumns()` to apply visibility too.

Source: `docs/framework/react/guide/column-ordering.md#what-affects-column-order`

### [HIGH] Using labels as identities

Wrong: `const activeId = column.columnDef.header as string`

Correct: `const activeId = column.id`

Headers can collide or change; ordering state stores stable leaf column IDs.

Source: `packages/table-core/src/features/column-ordering/columnOrderingFeature.types.ts`

### [HIGH] Mutating controlled state in place

Wrong: `columnOrder.splice(0, 1); table.setColumnOrder(columnOrder)`

Correct: `table.setColumnOrder(columnOrder.slice(1))`

Reactive owners commonly require a new array reference.

Source: `examples/react/column-dnd/src/main.tsx`

## API Discovery

Inspect `node_modules/@tanstack/table-core/dist/features/column-ordering/`; combine with pinning/visibility skills when those plugins are registered.
