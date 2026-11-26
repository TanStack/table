# Row selection

Selection is independent ID state; selected row models can only materialize loaded rows.

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

## Core patterns

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

### Prune stale parent ids on child deselection

```ts
export function getPruningHandler(row: Row<typeof features, Person>) {
  return row.getToggleSelectedHandler({ deselectParents: true })
}
```

Selecting a parent cascades its id plus selectable descendant ids into state, but deselecting a child later leaves the parent id behind by default (some tables treat state ids as literal selections, e.g. with `selectChildren: false`). The default `deselectParents: false` preserves that; set it to `true` so deselecting any row also deletes every ancestor id, keeping `row.getIsSelected()` honest for parents. Applies to `toggleSelected` and both plain and Shift-range handler paths.

### Select-all honors sub-row selection rules

With `enableSubRowSelection: false` (or a per-row predicate), `table.toggleAllRowsSelected()` skips descendants of blocking parents, and `getIsAllRowsSelected()`/`getIsAllPageRowsSelected()` exclude those descendants from the all-selected computation, so the header checkbox still reads checked. Deselect-all skips rows whose `enableRowSelection` resolves false, preserving their selection; use `toggleAllRowsSelected(false, { deselectAll: true })` or `resetRowSelection(true)` to clear everything including disabled and out-of-model ids.

### Select all rows of a remote table

```ts
export const remoteOptions = {
  getRowId: (row: Person) => row.id,
  manualRowSelection: true,
  rowCount: 100_000,
}
```

```ts
table.toggleAllRowsSelected(true) // rowSelectionMode 'exclude', rowSelection {}
table.getRow('7').toggleSelected(false) // rowSelection { 7: true }, the deselected ids
const selectedCount = table.getSelectedRowCount() // rowCount minus deselected rows
const bulkAction = {
  mode: table.atoms.rowSelectionMode.get(),
  ids: Object.keys(table.atoms.rowSelection.get()),
}
```

`manualRowSelection: true` allows the `'exclude'` value of the `rowSelectionMode` state; without the option the mode is always read as `'include'` and select-all writes the loaded row ids. With it, `toggleAllRowsSelected(true)` sets `'exclude'` and clears `rowSelection`, `toggleAllRowsSelected(false)` sets `'include'` and clears it, and `resetRowSelection()` resets both slices. In `'exclude'` mode a row is selected when its id is not in `rowSelection`, so rows that load later are selected, `getIsAllRowsSelected()` is true only with no ids, and the selected row models and `getSelectedRowIds()` hold only loaded rows. `getIsAllRowsSelected()` is never true in `'include'` mode under this option, because loaded rows are not all rows.

Set `rowCount` (top-level rows, the same option manual pagination reads) so `getSelectedRowCount()` is right and so a row, range, or page deselect goes back to an empty `'include'` selection when the deselected rows cover every row and no loaded row is still selected. Direct `setRowSelection()` writes and updaters applied later are not normalized. The count skips the ids of loaded sub-rows and group rows but subtracts an id that is not loaded as one row, so with tree data on more than one page take the count from the server. The table does not reset the selection when filters change: "all" means all rows matching the filters at click time, and the deselected ids and `rowCount` belong to those filters, so call `resetRowSelection()` whenever filters or `rowCount` change.

`enableRowSelection` only gates toggling. In `'exclude'` mode a row whose id is not in `rowSelection` is selected (`getIsSelected()`, selected row models, `getSelectedRowCount()`) even when it cannot be toggled, so the server must skip such rows if they must not be part of a bulk action. The row handler and the page APIs skip such a row, so `getIsSomePageRowsSelected()` can be false while `getIsSomeRowsSelected()` is true, and the table stays in `'exclude'` mode while the row is loaded. Select-all is a no-op when `enableRowSelection` is `false` and stays in `'include'` mode when `rowCount` is `0`. `enableSubRowSelection` only cascades to loaded sub-rows; the server must decide how a parent applies to sub-rows that are not loaded.

## Common mistakes

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

### [HIGH] Reading exclude-mode ids as the selected ids

Wrong:

```ts
const selectedIds = Object.keys(table.atoms.rowSelection.get())
```

Correct:

```ts
const mode = table.atoms.rowSelectionMode.get()
const ids = Object.keys(table.atoms.rowSelection.get())
const bulkAction =
  mode === 'exclude' ? { allRowsExcept: ids } : { onlyRows: ids }
```

With `manualRowSelection: true`, select-all switches `rowSelectionMode` to `'exclude'` and the keys of `rowSelection` become the deselected row ids. Read the mode with the map, or use `row.getIsSelected()` and `table.getSelectedRowCount()`.

Source: `docs/framework/react/guide/row-selection.md#select-all-rows-of-a-remote-table`

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

## API discovery

Inspect `node_modules/@tanstack/table-core/dist/features/row-selection/` for state, row-model variants, and selection enablement callbacks.

## Sources

- `TanStack/table:docs/framework/react/guide/row-selection.md`
- `TanStack/table:packages/table-core/src/features/row-selection`
- `TanStack/table:examples/react/row-selection`
