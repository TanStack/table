---
title: Cell Selection (Solid) Guide
---

## Examples

Want to skip to the implementation? Check out these Solid examples:

- [Cell Selection](../examples/cell-selection)

### Cell Selection Setup

Here's how you set up your table to use cell selection features. Adding the cell selection feature enables the related APIs.

```ts
import {
  createTable,
  tableFeatures,
  cellSelectionFeature,
} from '@tanstack/solid-table'

const features = tableFeatures({ cellSelectionFeature })

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
```

## Cell Selection (Solid) Guide

The cell selection feature keeps track of spreadsheet-style rectangular selections. A user can click a cell, drag across a block of cells, Shift-click to extend, and Ctrl/Cmd-drag to add or subtract a rectangle based on whether the starting cell is selected. Let's take a look at some common use cases.

### Access Cell Selection State

The table instance already manages the cell selection state for you. You can access the selection or values derived from it through a few APIs.

- `table.atoms.cellSelection.get()` - returns the current cell selection (a tracked signal read inside JSX, memos, and effects; a plain snapshot elsewhere)
- `getSelectedCellCount()` - returns how many cells are selected
- `getSelectedCellIds()` - returns the ids of every selected cell
- `getCellSelectionRowIds()` / `getCellSelectionColumnIds()` - returns the rows and columns the selection touches
- `getSelectedCellRangesData()` - returns each final positive selection region's values as a row-major grid

```ts
console.log(table.atoms.cellSelection.get()) //get the cell selection state
console.log(table.getSelectedCellCount()) //3
console.log(table.getSelectedCellIds()) //['0_firstName', '0_lastName', '1_firstName']
console.log(table.getSelectedCellRangesData()) //[[['Tanner', 'Linsley'], ['Kevin', 'Vandy']]]
```

Reads of `table.atoms.cellSelection.get()` are tracked inside Solid reactive contexts, so they stay fresh automatically. Outside one, the same call is a plain snapshot.

The expansion APIs (`getSelectedCellIds`, `getSelectedCellRangesData`) are memoized and pull-based. They cost nothing unless you actually call them, so a table that only highlights cells never pays to enumerate a large selection.

### Cell Selection State Shape

`CellSelectionState` is an ordered array of range operations, each stored as its two defining corners:

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

The `anchor` corner is where the selection started and stays put. The `focus` corner is the one that moves while dragging or Shift-extending. Storing both corners, rather than a normalized min/max rectangle, is what makes Shift-extend and "collapse back to the active cell" possible.

Ranges are applied in order. An omitted `operation` is an inclusion for backward compatibility; an `exclude` range subtracts its rectangle from the selection produced so far. This compact operation log means a "select all except these cells" interaction does not build a map with one entry per selected cell.

### Manage Cell Selection State

If you need access to the selection elsewhere in your application, you can own the state slice yourself. The recommended way in v9 is an external atom passed through the `atoms` table option.

```ts
import { createAtom } from '@tanstack/solid-store'
import {
  createTable,
  tableFeatures,
  cellSelectionFeature,
  type CellSelectionState,
} from '@tanstack/solid-table'

const features = tableFeatures({ cellSelectionFeature })

const cellSelectionAtom = createAtom<CellSelectionState>([])

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
  atoms: { cellSelection: cellSelectionAtom },
})
```

The classic controlled-state pattern also works:

```ts
const [cellSelection, setCellSelection] = createSignal<CellSelectionState>([])

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
  get state() {
    return { cellSelection: cellSelection() }
  },
  onCellSelectionChange: setCellSelection,
})
```

> [!NOTE]
> a drag emits one change per cell boundary the pointer crosses, so `onCellSelectionChange` fires repeatedly during a drag. If you are syncing selection to a server or a URL, debounce it or commit on `mouseup`.

### Useful Row Ids

Cell selection is keyed by row id and column id, so a meaningful row id matters here for the same reason it does with row selection. Use the `getRowId` table option to key selection by something stable from your data.

```ts
const table = createTable({
  features,
  //...
  getRowId: (row) => row.uuid, // use the row's uuid from your database as the row id
})
```

### Enable Cell Selection Conditionally

Cell selection is enabled by default for every cell. Use the `enableCellSelection` table option to turn it off entirely, or pass a function for per-cell control.

```ts
const table = createTable({
  features,
  //...
  enableCellSelection: (cell) => cell.row.original.age > 18, //only adults' cells are selectable
})
```

A column def can also opt out, which is the common case for checkbox or action columns. A column-level `false` wins over the table option.

```ts
columnHelper.accessor('actions', {
  enableCellSelection: false, //this column can never be selected
})
```

A cell that cannot be selected is skipped even when a rectangle is drawn straight through it, and `moveCellSelection` steps over its column rather than landing on it. Use `cell.getCanSelect()` to decide whether to attach selection handlers in your UI.

### Mouse Interactions

Two cell handlers drive every mouse interaction:

- `cell.getSelectionStartHandler()` - bind to `onMouseDown`
- `cell.getSelectionExtendHandler()` - bind to `onMouseEnter`

```tsx
<td
  onMouseDown={cell.getSelectionStartHandler()}
  onMouseEnter={cell.getSelectionExtendHandler()}
>
  <FlexRender cell={cell} />
</td>
```

You do not need to handle `mouseup` yourself. The start handler attaches its own document-level `mouseup` listener and removes it when the drag ends, so releasing the pointer outside the table still finishes the drag correctly. If your table renders into another document, such as an iframe or a popout window, pass that document in: `cell.getSelectionStartHandler(myDocument)`.

#### Drag Selection

Pressing down on a cell starts a new single-cell range, and every cell the pointer then enters moves that range's focus corner. Set `enableCellSelectionDrag: false` to require explicit clicks instead.

#### Shift Range Selection

Shift-clicking moves the active range's focus corner to the clicked cell, keeping its anchor fixed. The active cell therefore stays where the selection started, matching spreadsheet behavior.

The handler recognizes Shift when the event exposes either `event.shiftKey` or `event.nativeEvent.shiftKey`. You can disable range behavior or replace the detection:

```ts
const table = createTable({
  features,
  //...
  enableCellRangeSelection: false,

  // For example, use the platform modifier instead of Shift:
  // isCellRangeSelectionEvent: event => Boolean(event.metaKey),
})
```

#### Multiple Ranges

Ctrl-clicking or Cmd-clicking an unselected cell adds a new inclusive rectangle. Starting the same modified interaction on a selected cell adds an exclusion instead, so clicking removes that cell and dragging subtracts the whole rectangle. Whether the drag includes or excludes is fixed when it starts; shrinking an exclusion drag restores cells that leave its rectangle. Set `enableMultiCellRangeSelection: false` to disable both behaviors, or override `isMultiCellRangeSelectionEvent` to change the modifier.

#### Programmatic Range Operations

`table.selectCellRange(range)` replaces the current selection. Pass `{ mode: 'include' }` to append an inclusion or `{ mode: 'exclude' }` to append an exclusion. The older `{ additive: true }` option remains as a deprecated alias for include mode; `mode` wins if both options are supplied. `table.getCellSelectionBounds()` resolves the operation log into deterministic, disjoint positive rectangles.

### Render Cell Selection UI

TanStack Table does not dictate how you render selected cells. These cell APIs give you everything you need:

- `cell.getIsSelected()` - whether this cell falls inside any range
- `cell.getIsFocused()` - whether this is the active cell (an excluded anchor can be focused without being selected)
- `cell.getSelectionEdges()` - which sides sit on the selection boundary
- `cell.getTabIndex()` - `0` for the focused cell and `-1` otherwise, for roving tabindex

`getSelectionEdges()` returns `{ top, right, bottom, left }`, where a side is `true` when the neighboring cell in that direction is not itself selected. That is what lets you draw a single continuous outline around a selection, including around a union of separate rectangles, without every cell inspecting its neighbors.

```tsx
function getCellClassName(cell) {
  // most cells are unselected, so bail before asking for edges
  if (!cell.getIsSelected()) {
    return cell.getIsFocused() ? 'cell cell-focused' : 'cell'
  }

  const edges = cell.getSelectionEdges()

  return [
    'cell',
    'cell-selected',
    cell.getIsFocused() && 'cell-focused',
    edges.top && 'cell-edge-top',
    edges.right && 'cell-edge-right',
    edges.bottom && 'cell-edge-bottom',
    edges.left && 'cell-edge-left',
  ]
    .filter(Boolean)
    .join(' ')
}
```

> [!TIP]
> draw the outline with `box-shadow: inset ...` rather than `border`. On a `border-collapse` table a thicker border widens the shared grid line, which makes rows change height as cells become selected. A box-shadow never affects layout.

### Keyboard Navigation

Cell selection ships no keyboard handling of its own. Instead it exposes imperative APIs so a dedicated library, such as [TanStack Hotkeys](https://tanstack.com/hotkeys), can drive it:

- `table.moveCellSelection(direction)` - collapse the selection to a single cell one step away
- `table.extendCellSelection(direction)` - move the active range's focus corner, keeping its anchor
- `table.setFocusedCell(rowId, columnId)` - collapse the selection to one specific cell
- `table.selectAllCells()` - select every selectable cell
- `table.resetCellSelection(true)` - clear the selection

`direction` is `'up'`, `'down'`, `'left'`, or `'right'`.

```ts
import { createHotkeys } from '@tanstack/solid-hotkeys'

let gridRef!: HTMLDivElement

createHotkeys(
  [
    { hotkey: 'ArrowUp', callback: () => table.moveCellSelection('up') },
    { hotkey: 'ArrowDown', callback: () => table.moveCellSelection('down') },
    {
      hotkey: 'Shift+ArrowDown',
      callback: () => table.extendCellSelection('down'),
    },
    { hotkey: 'Mod+A', callback: () => table.selectAllCells() },
    { hotkey: 'Escape', callback: () => table.resetCellSelection(true) },
  ],
  () => ({ target: gridRef }),
)
```

Scope the hotkeys to the grid element rather than the document, or arrow keys and Escape will hijack inputs elsewhere on the page.

### Copying a Selection

`getSelectedCellRangesData()` returns raw values indexed as `[regionIndex][rowIndex][columnIndex]`. A region is one of the final disjoint positive rectangles after all include and exclude operations are applied, so it does not necessarily correspond one-to-one with stored state. Turning that into clipboard text is left to your application, because the delimiter, the representation of `null`, and any quoting rules are decisions only you can make.

```ts
function escapeTsvValue(value: unknown) {
  const text = value == null ? '' : String(value)
  const safeText =
    typeof value === 'string' && /^[\t\r ]*[=+@-]/.test(value)
      ? `'${text}`
      : text
  // spreadsheets expect a quoted field once it contains a delimiter, a newline,
  // or a quote, with inner quotes doubled
  return /["\t\n\r]/.test(safeText)
    ? `"${safeText.replace(/"/g, '""')}"`
    : safeText
}

function toTsv(ranges: Array<Array<Array<unknown>>>) {
  return ranges
    .map((grid) =>
      grid.map((row) => row.map(escapeTsvValue).join('\t')).join('\n'),
    )
    .join('\n\n')
}

navigator.clipboard.writeText(toTsv(table.getSelectedCellRangesData()))
```

### How Ranges Survive Table Changes

Ranges store row and column ids, not positions, so they follow their corner cells rather than screen coordinates.

- **Sorting, filtering, and column reordering** keep the corners pinned and recompute what sits between them. A range from "row A to row B" still runs from A to B after a sort, even though different rows now fall in between.
- **Column pinning** is accounted for in render order, so a rectangle stays visually contiguous when a column is pinned.
- **Hiding a column** that a corner sits on makes the range inert. Nothing renders as selected, but the range stays in state and comes back when the column is shown again.
- **Pagination** resolves against the pre-pagination order, so a range can span pages and lights up correctly on whichever page you are viewing.

Because a reorder can widen a selection onto columns the user never picked, some applications prefer to clear the selection whenever the column layout changes. That is a userland decision; a deferred Solid effect can implement it:

```ts
createEffect(
  on(
    () => [
      table.atoms.columnOrder.get(),
      table.atoms.columnPinning.get(),
      table.atoms.columnVisibility.get(),
    ],
    () => table.resetCellSelection(true),
    { defer: true }, // skip the first run so an initialState selection survives
  ),
)
```

### Resetting Cell Selection

`table.resetCellSelection()` restores `initialState.cellSelection`. Pass `true` to ignore initial state and clear the selection entirely.

The selection also resets automatically whenever `data` changes, because new data can invalidate the row ids a range points at, or silently re-select cells if the new data happens to reuse ids. Turn that off with `autoResetCellSelection: false`, and note that `autoResetAll` overrides it.

```ts
const table = createTable({
  features,
  //...
  autoResetCellSelection: false, //keep ranges across data changes
})
```

### Performance

Solid tracks atom reads natively, so a selection change re-runs only the memos
and JSX expressions that actually read it. There is no equivalent of React's
per-row `Subscribe` to reach for here, and the example renders its cells plainly.

Measured on a table with a thousand rows and twelve columns, a drag updates in
roughly 13ms per move with plain reads and no subscription primitive at all.

The per-cell reads are cheap by design. `cell.getIsSelected()` resolves the
cell's row and column index and compares them against a memoized cache of the
selection bounds, which is a handful of integer comparisons. If a very large
table does become a bottleneck, reach for
[virtualization](./virtualization) so that only visible rows exist in the DOM,
rather than for a subscription pattern.
