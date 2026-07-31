---
name: row-selection
description: >
  Maintain rowSelection ID state with stable getRowId, single, multi, subrow, and Shift-range rules, selected row models, handler anchors, and manual-pagination semantics. Load when implementing getToggleSelectedHandler, enableRowRangeSelection, selectChildren, or selected IDs that outlive loaded Row objects.
metadata:
  {
    type: sub-skill,
    library: '@tanstack/table-core',
    library_version: '9.0.0-beta.64',
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
import {
  rowSelectionFeature,
  tableFeatures,
  type Row,
} from '@tanstack/table-core'

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

### Inclusive Shift ranges through the row handler

```ts
export function getSelectionHandler(row: Row<typeof features, Person>) {
  return row.getToggleSelectedHandler()
}
```

The handler establishes a table-local anchor on ordinary interactions and applies the checked value to the inclusive current display-order range on Shift interactions. Range behavior is enabled by default; set `enableRowRangeSelection: false` to preserve non-range handler behavior. Direct `row.toggleSelected()` and `table.setRowSelection()` calls do not move that anchor.

Pass the original checkbox click event to this handler. DOM `change` events often omit modifier keys, so use the framework's click binding for row checkboxes unless its change event exposes the original click through `nativeEvent` (as React does).

### Limit a range to explicitly displayed rows

```ts
export function getDisplayedRowsOnlyHandler(row: Row<typeof features, Person>) {
  return row.getToggleSelectedHandler({ selectChildren: false })
}
```

The default `selectChildren: true` recursively changes selectable descendants of parents encountered in the range. Set it to `false` when collapsed descendants outside the display-order interval must remain unchanged.

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

### [HIGH] Bypassing the range-selection handler

Wrong:

```ts
const onChange = (event: { target: { checked: boolean } }) =>
  row.toggleSelected(event.target.checked)
```

Correct:

```ts
const onChange = row.getToggleSelectedHandler()
```

Only successful interactions through `getToggleSelectedHandler()` establish or advance the Shift-range anchor. The handler also supports custom range-event detection through `isRowRangeSelectionEvent`.

Source: `docs/framework/react/guide/row-selection.md#shift-range-selection`

### [HIGH] Binding a DOM change event that drops Shift

Wrong:

```ts
checkbox.addEventListener('change', row.getToggleSelectedHandler())
```

Correct:

```ts
checkbox.addEventListener('click', row.getToggleSelectedHandler())
```

The range modifier must be present on the event passed to the handler. Raw DOM `change` events do not reliably expose click modifier keys.

Source: `docs/framework/svelte/guide/row-selection.md#shift-range-selection`

### [MEDIUM] Expecting ranges across unloaded server pages

Wrong:

```ts
const options = {
  manualPagination: true,
  enableRowRangeSelection: true,
}
// Shift cannot select rows absent from data.
```

Correct:

```ts
const options = {
  manualPagination: true,
  getRowId: (row: Person) => row.id,
}
```

Client-side ranges can cross pages because display order is pre-pagination. Manual/server pagination cannot include rows absent from the loaded `data`; select database-wide IDs in application state when that behavior is required.

Source: `docs/framework/react/guide/row-selection.md#shift-range-selection`, `https://github.com/TanStack/table/issues/4781`

## API Discovery

Inspect `node_modules/@tanstack/table-core/dist/features/row-selection/` for state, row-model variants, and selection enablement callbacks.
