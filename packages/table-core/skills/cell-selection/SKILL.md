---
name: cell-selection
description: >
  Select, add, and subtract rectangular cell ranges with cellSelectionFeature: ordered include/exclude operations keyed by row and column id, modifier dragging, final positive bounds, selection edges, render-order resolution under pinning, and autoResetCellSelection. Load for spreadsheet-style selection, “select all except” behavior, unexpected range changes after sorting or reordering, drag performance, or copy-to-clipboard.
metadata:
  {
    type: sub-skill,
    library: '@tanstack/table-core',
    library_version: '9.0.0-beta.76',
  }
requires: ['core', 'table-features']
sources:
  - 'TanStack/table:docs/framework/react/guide/cell-selection.md'
  - 'TanStack/table:packages/table-core/src/features/cell-selection'
  - 'TanStack/table:examples/react/cell-selection'
---

This skill builds on `core` and `table-features`. `cellSelection` is an ordered operation log of rectangles, each stored as two corner cells identified by row and column id. It is not a per-cell map, and it is not positional. Table resolves the log into disjoint positive rectangles for membership and derived reads.

## Setup

```ts
import { cellSelectionFeature, tableFeatures } from '@tanstack/table-core'

type Person = { id: string; name: string }
export const features = tableFeatures({ cellSelectionFeature })
export const options = {
  getRowId: (row: Person) => row.id,
}
```

State shape:

```ts
type CellSelectionRange = {
  anchorRowId: string
  anchorColumnId: string
  focusRowId: string
  focusColumnId: string
  operation?: 'include' | 'exclude'
}
type CellSelectionState = Array<CellSelectionRange>
```

The `anchor` corner stays put; the `focus` corner moves during a drag or Shift-extend. Two corners are what make Shift-extend possible, and they keep a drag across thousands of cells to a two-field write. Operations apply in array order. An omitted `operation` means `include` for backward compatibility; `exclude` subtracts from the selection produced by preceding entries.

## Core Patterns

### Bind both mouse handlers

```ts
const onMouseDown = cell.getSelectionStartHandler()
const onMouseEnter = cell.getSelectionExtendHandler()
```

The start handler attaches its own document-level `mouseup` listener and removes it when the drag ends, so a pointer released outside the table still finishes correctly. Pass a document explicitly (`cell.getSelectionStartHandler(iframeDocument)`) only when the table renders into another document.

With the default event predicates, Shift extends the active operation. Ctrl/Cmd starts an inclusion when the starting cell is unselected and an exclusion when it is selected. That choice remains fixed for the drag, so shrinking an exclusion restores cells that leave its rectangle. Set `enableMultiCellRangeSelection: false` to disable both modifier behaviors.

### Apply ranges programmatically

```ts
table.selectCellRange(range) // replace
table.selectCellRange(range, { mode: 'include' })
table.selectCellRange(range, { mode: 'exclude' })
```

Use `mode` when the operation is known. The deprecated `{ additive: true }` option is only an alias for include mode; an explicit `mode` wins.

### Read the selection

```ts
const count = table.getSelectedCellCount()
const bounds = table.getCellSelectionBounds()
const grids = table.getSelectedCellRangesData() // [range][row][column]
```

`bounds` and `grids` describe the final disjoint positive regions after all operations, not one entry per stored state operation. Expansion APIs are memoized and pull-based, so a table that only highlights cells never pays to enumerate a large selection. Cell count uses rectangle arithmetic unless a per-cell `enableCellSelection` predicate requires enumeration.

### Draw the outline from edges

`cell.getSelectionEdges()` marks a side `true` when the neighbouring cell in that direction is not selected, which yields one continuous outline around a union of rectangles. All sides are `false` when the cell is not selected.

### Drive keyboard navigation externally

The feature ships no keydown handling. Call `table.moveCellSelection(direction)`, `table.extendCellSelection(direction)`, `table.setFocusedCell(rowId, columnId)`, `table.selectAllCells()`, and `table.resetCellSelection(true)` from a hotkey library such as `@tanstack/react-hotkeys`, scoped to the grid element rather than the document. Extending preserves the active operation. `getFocusedCell()` follows the latest anchor, so an excluded cell can remain focused without being selected.

## Common Mistakes

### [HIGH] Expecting a per-cell selection map

Wrong: `const isSelected = table.state.cellSelection[cell.id]`

Correct: `const isSelected = cell.getIsSelected()`

`cellSelection` holds ordered rectangle operations, not cell keys. Membership is resolved against the memoized final positive bounds.

Source: `packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts`

### [HIGH] Treating stored operations as final selected regions

Wrong: serialize or render each `table.state.cellSelection` entry as a selected rectangle.

Correct: use `table.getCellSelectionBounds()`, `cell.getIsSelected()`, or `table.getSelectedCellRangesData()` for the resolved selection.

An exclusion is an instruction, not a selected region, and a subtraction can split one included rectangle into four disjoint positive regions. Re-including a later rectangle applies after the exclusion because state order is significant.

Source: `packages/table-core/src/features/cell-selection/cellSelectionGeometry.ts`

### [HIGH] Assuming a range is frozen to the cells it originally covered

Ranges are anchored to corner ids, so sorting, filtering, and column reordering keep the corners and recompute what sits between them. A range can therefore widen onto columns or rows the user never selected. Reset in userland when the product needs stricter behavior:

```ts
// after a column reorder or pin
table.resetCellSelection(true)
```

Hiding a column that a corner sits on makes the range inert rather than deleting it; it returns when the column is shown again.

Source: `docs/framework/react/guide/cell-selection.md#how-ranges-survive-table-changes`

### [HIGH] Binding only mousedown and expecting drag

Wrong:

```ts
const props = { onMouseDown: cell.getSelectionStartHandler() }
```

Correct:

```ts
const props = {
  onMouseDown: cell.getSelectionStartHandler(),
  onMouseEnter: cell.getSelectionExtendHandler(),
}
```

Without the extend handler a drag selects only the origin cell. Do not add a `mouseup` binding; the start handler already owns one.

Source: `examples/react/cell-selection`

### [HIGH] Deriving column position from column definition order

Wrong: `const index = column.getIndex()`

Correct: `const isSelected = cell.getIsSelected()`

Cells render start-pinned first, then center, then end. `getVisibleLeafColumns()` and `column.getIndex()` are not pinning-reordered, so indexing a selection against them makes a rectangle visually scattered as soon as a column is pinned. The feature resolves its own render-order index map; use the cell APIs rather than recomputing membership.

Source: `packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts`

### [HIGH] Re-rendering every cell on each drag update

Wrong: one subscription wrapping the whole `<tbody>`.

Correct: one subscription per row, with a selector returning only what changes that row's appearance.

A drag writes state on every cell boundary crossed. A table-wide subscription reconciles every cell each time. Subscribe per row against `table.atoms.cellSelection` and derive a key from `table.getCellSelectionBounds()` (memoized, so it computes once per change) covering the row itself plus the rows above and below, which decide its top and bottom edges.

Source: `docs/framework/react/guide/cell-selection.md#performance-with-tablesubscribe`

### [MEDIUM] Drawing selection borders on a border-collapse table

Wrong: `.cell-selected { border: 2px solid blue }`

Correct: `.cell-selected { box-shadow: inset 0 0 0 2px blue }`

On a `border-collapse` table a thicker border widens the shared grid line, so rows change height as cells become selected. Box-shadow never affects layout.

Source: `examples/react/cell-selection/src/index.css`

### [MEDIUM] Expecting a clipboard string from the table

Wrong: `navigator.clipboard.writeText(table.getSelectedCellsAsTsv())`

Correct: `navigator.clipboard.writeText(toTsv(table.getSelectedCellRangesData()))`

The table returns raw values only. The delimiter, the representation of `null`, and quoting rules are application decisions, so serialization is userland. Quote any field containing a tab, newline, or quote, or a pasted spreadsheet gains phantom columns.

Source: `docs/framework/react/guide/cell-selection.md#copying-a-selection`

### [MEDIUM] Persisting a selection and expecting drag state with it

`cellSelection` is safe to persist because drag session state is deliberately non-reactive instance data, not part of the slice. Preserve array order and each `operation`; sorting or deduplicating the entries changes the resolved selection. Do not add an `isSelecting` field to the persisted state; a stored `true` would rehydrate into a drag that hovering extends and nothing ever ends.

Source: `packages/table-core/src/features/cell-selection/cellSelectionFeature.types.ts`

### [MEDIUM] Fighting the automatic reset on data change

Selection resets to `initialState.cellSelection` whenever `data` changes, because new data can invalidate the row ids a range points at or silently re-select cells when ids are reused. Opt out deliberately:

```ts
export const keepAcrossDataChanges = { autoResetCellSelection: false }
```

`autoResetAll` overrides this option.

Source: `packages/table-core/src/features/cell-selection/cellSelectionFeature.ts`

## API Discovery

Inspect `node_modules/@tanstack/table-core/dist/features/cell-selection/` for `CellSelectionRange`, `CellSelectionRangeOperation`, `CellSelectionRangeMode`, `CellSelectionState`, `CellSelectionBounds`, `SelectCellRangeOptions`, the enablement and `is*Event` options, and the cell and table instance APIs.
