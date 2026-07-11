---
name: row-selection
description: >
  Maintain rowSelection ID state with stable getRowId, single, multi, and subrow rules, selected row models, and manual-pagination semantics. Load when selected IDs outlive loaded Row objects or data removal.
metadata:
  {
    type: sub-skill,
    library: '@tanstack/table-core',
    library_version: '9.0.0-beta.42',
  }
requires: ['core', 'table-features']
sources:
  - 'TanStack/table:docs/framework/react/guide/row-selection.md'
  - 'TanStack/table:packages/table-core/src/features/row-selection'
  - 'TanStack/table:examples/react/row-selection'
---

This skill builds on `core` and `table-features`. Selection is independent ID state; selected row models can only materialize loaded rows.

## Setup

```ts
import { rowSelectionFeature, tableFeatures } from '@tanstack/table-core'

type Person = { id: string; name: string }
export const features = tableFeatures({ rowSelectionFeature })
export const options = {
  getRowId: (row: Person) => row.id,
  enableSubRowSelection: false,
}
```

## Core Patterns

```ts
const selectedIds = table.getSelectedRowIds()
const loadedSelectedRows = table.getSelectedRowModel().rows
```

Use IDs for database-wide intent and row models for currently loaded objects.

## Common Mistakes

### [HIGH] Expecting selection to clean itself

Wrong: `data = data.filter(row => row.id !== deletedId)`

Correct: `data = data.filter(row => row.id !== deletedId); table.setRowSelection(old => { const next = { ...old }; delete next[deletedId]; return next })`

Selection is independent state and can retain IDs after data removal.

Source: `https://github.com/TanStack/table/issues/5850`

### [HIGH] Selecting mutable indexes

Wrong: `const options = { getRowId: (_row: Person, index: number) => String(index) }`

Correct: `const options = { getRowId: (row: Person) => row.id }`

Stable application IDs preserve identity as row order and pages change.

Source: `docs/framework/react/guide/row-selection.md#useful-row-ids`

### [HIGH] Treating loaded model as global selection

Wrong: `const allSelectedRecords = table.getSelectedRowModel().rows`

Correct: `const allSelectedIds = table.getSelectedRowIds()`

Under manual pagination, unloaded selected IDs have no `Row` object in the current model.

Source: `docs/framework/react/guide/row-selection.md#note-if-you-are-using-manualpagination`

## API Discovery

Inspect `node_modules/@tanstack/table-core/src/features/row-selection/` for state, row-model variants, and selection enablement callbacks.
