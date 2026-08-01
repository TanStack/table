---
name: column-visibility
description: >
  Hide columns with columnVisibilityFeature while rendering visibility-aware header, column, and cell collections. Load when hidden columns remain in the DOM, false-versus-absent state is confused, or enableHiding is misunderstood.
metadata:
  {
    type: sub-skill,
    library: '@tanstack/table-core',
    library_version: '9.0.0-beta.69',
  }
requires: ['core', 'table-features']
sources:
  - 'TanStack/table:docs/framework/react/guide/column-visibility.md'
  - 'TanStack/table:packages/table-core/src/features/column-visibility'
  - 'TanStack/table:examples/react/column-visibility'
---

This skill builds on `core` and `table-features`. Visibility state changes visibility-aware models; it never removes the column definition.

## Setup

```ts
import { columnVisibilityFeature, tableFeatures } from '@tanstack/table-core'

export const features = tableFeatures({ columnVisibilityFeature })
export const initialState = { columnVisibility: { internalId: false } }
```

## Core Patterns

```ts
const headers = table.getHeaderGroups()
const cells = row.getVisibleCells()
const toggles = table
  .getAllLeafColumns()
  .filter((column) => column.getCanHide())
```

Use all-column APIs for controls and visible APIs for rendered table content.

## Common Mistakes

### [HIGH] Rendering hidden cells anyway

Wrong: `row.getAllCells().map(renderCell)`

Correct: `row.getVisibleCells().map(renderCell)`

All-cell APIs intentionally include hidden columns.

Source: `docs/framework/react/guide/column-visibility.md#column-visibility-aware-table-apis`

### [HIGH] Treating absence as hidden

Wrong: `const hidden = !columnVisibility[column.id]`

Correct: `const hidden = columnVisibility[column.id] === false`

Only explicit `false` hides a column; an absent entry is visible.

Source: `packages/table-core/src/features/column-visibility/columnVisibilityFeature.ts`

### [MEDIUM] Treating enableHiding as visibility

Wrong: `helper.accessor('id', { enableHiding: false })`

Correct: `const initialState = { columnVisibility: { id: false } }`

`enableHiding` controls whether hiding is allowed; visibility belongs in table state.

Source: `packages/table-core/src/features/column-visibility/columnVisibilityFeature.types.ts`

## API Discovery

Inspect `node_modules/@tanstack/table-core/dist/features/column-visibility/` for visibility-aware table, row, and column APIs.
