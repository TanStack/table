---
title: Cell Selection (Alpine) Guide
---

## Examples

Want to skip to the implementation? Check out these Alpine examples:

- [Cell Selection](../examples/cell-selection)

### Cell Selection Setup

Here's how you set up your table to use cell selection features. Adding the cell selection feature enables the related APIs.

```ts
import Alpine from 'alpinejs'
import {
  createTable,
  tableFeatures,
  cellSelectionFeature,
} from '@tanstack/alpine-table'

const features = tableFeatures({ cellSelectionFeature })

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: defaultData })

  const table = createTable(
    {
      features,
      columns,
      get data() {
        return local.data
      },
    },
    // the selector decides which slices bump Alpine's version counter;
    // cellSelection has to be here or the highlight never moves
    (state) => ({ cellSelection: state.cellSelection }),
  )

  return { table }
})
```

## Cell Selection (Alpine) Guide

The cell selection feature keeps track of spreadsheet-style rectangular selections. A user can click a cell, drag across a block of cells, Shift-click to extend, and Ctrl/Cmd-click to add a second rectangle. Let's take a look at some common use cases.

### Access Cell Selection State

The table instance already manages the cell selection state for you. You can access the selection or values derived from it through a few APIs.

- `table.atoms.cellSelection.get()` - returns the current cell selection. Alpine re-renders from a version counter, so include `cellSelection` in the `createTable` selector for the DOM to update
- `getSelectedCellCount()` - returns how many cells are selected
- `getSelectedCellIds()` - returns the ids of every selected cell
- `getCellSelectionRowIds()` / `getCellSelectionColumnIds()` - returns the rows and columns the selection touches
- `getSelectedCellRangesData()` - returns each selected rectangle's values as a row-major grid

```ts
console.log(table.atoms.cellSelection.get()) //get the cell selection state
console.log(table.getSelectedCellCount()) //3
console.log(table.getSelectedCellIds()) //['0_firstName', '0_lastName', '1_firstName']
console.log(table.getSelectedCellRangesData()) //[[['Tanner', 'Linsley'], ['Kevin', 'Vandy']]]
```

Reads of `table.atoms.cellSelection.get()` are tracked inside Alpine reactive contexts, so they stay fresh automatically. Outside one, the same call is a plain snapshot.

The expansion APIs (`getSelectedCellIds`, `getSelectedCellRangesData`) are memoized and pull-based. They cost nothing unless you actually call them, so a table that only highlights cells never pays to enumerate a large selection.

### Cell Selection State Shape

`CellSelectionState` is an array of rectangles, each stored as its two defining corners:

```ts
type CellSelectionRange = {
  anchorRowId: string
  anchorColumnId: string
  focusRowId: string
  focusColumnId: string
}

type CellSelectionState = Array<CellSelectionRange>
```

The `anchor` corner is where the selection started and stays put. The `focus` corner is the one that moves while dragging or Shift-extending. Storing both corners, rather than a normalized min/max rectangle, is what makes Shift-extend and "collapse back to the active cell" possible.

Because ranges are only two corners, a drag across thousands of cells updates two strings rather than building a map with one entry per selected cell.

### Manage Cell Selection State

If you need access to the selection elsewhere in your application, you can own the state slice yourself. The recommended way in v9 is an external atom passed through the `atoms` table option.

```ts
import { createAtom } from '@tanstack/store'
import {
  createTable,
  tableFeatures,
  cellSelectionFeature,
  type CellSelectionState,
} from '@tanstack/alpine-table'

const features = tableFeatures({ cellSelectionFeature })
const cellSelectionAtom = createAtom<CellSelectionState>([])

const table = createTable(
  {
    features,
    columns,
    get data() {
      return local.data
    },
    atoms: { cellSelection: cellSelectionAtom },
  },
  (state) => ({ cellSelection: state.cellSelection }),
)
```

The classic controlled-state pattern also works:

```ts
const local = Alpine.reactive({ data, cellSelection: [] as CellSelectionState })

const table = createTable(
  {
    features,
    columns,
    get data() {
      return local.data
    },
    get state() {
      return { cellSelection: local.cellSelection }
    },
    onCellSelectionChange: (updater) => {
      local.cellSelection =
        typeof updater === 'function' ? updater(local.cellSelection) : updater
    },
  },
  (state) => ({ cellSelection: state.cellSelection }),
)
```

> Note: a drag emits one change per cell boundary the pointer crosses, so `onCellSelectionChange` fires repeatedly during a drag. If you are syncing selection to a server or a URL, debounce it or commit on `mouseup`.

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

```html
<td
  @mousedown="onCellMouseDown(cell, $event)"
  @mouseenter="onCellMouseEnter(cell, $event)"
>
  <span x-html="FlexRender({ cell })"></span>
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

Ctrl-clicking or Cmd-clicking pushes an additional rectangle onto the selection instead of replacing it. Set `enableMultiCellRangeSelection: false` to allow only one rectangle at a time, or override `isMultiCellRangeSelectionEvent` to change the modifier.

### Render Cell Selection UI

TanStack Table does not dictate how you render selected cells. These cell APIs give you everything you need:

- `cell.getIsSelected()` - whether this cell falls inside any range
- `cell.getIsFocused()` - whether this is the active cell
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

> Tip: draw the outline with `box-shadow: inset ...` rather than `border`. On a `border-collapse` table a thicker border widens the shared grid line, which makes rows change height as cells become selected. A box-shadow never affects layout.

### Keyboard Navigation

Cell selection ships no keyboard handling of its own. Instead it exposes imperative APIs so a dedicated library, such as [TanStack Hotkeys](https://tanstack.com/hotkeys), can drive it:

- `table.moveCellSelection(direction)` - collapse the selection to a single cell one step away
- `table.extendCellSelection(direction)` - move the active range's focus corner, keeping its anchor
- `table.setFocusedCell(rowId, columnId)` - collapse the selection to one specific cell
- `table.selectAllCells()` - select every selectable cell
- `table.resetCellSelection(true)` - clear the selection

`direction` is `'up'`, `'down'`, `'left'`, or `'right'`.

```ts
import { createMultiHotkeyHandler } from '@tanstack/hotkeys'

// Alpine has no hotkeys adapter, so the framework-agnostic core handler is used
onGridKeyDown: createMultiHotkeyHandler({
  ArrowUp: () => table.moveCellSelection('up'),
  ArrowDown: () => table.moveCellSelection('down'),
  'Shift+ArrowDown': () => table.extendCellSelection('down'),
  'Mod+A': () => table.selectAllCells(),
  Escape: () => table.resetCellSelection(true),
}),

// then, in the markup:
// <div tabindex="-1" @keydown="onGridKeyDown($event)"> ... </div>
```

Scope the hotkeys to the grid element rather than the document, or arrow keys and Escape will hijack inputs elsewhere on the page.

### Copying a Selection

`getSelectedCellRangesData()` returns raw values indexed as `[rangeIndex][rowIndex][columnIndex]`. Turning that into clipboard text is left to your application, because the delimiter, the representation of `null`, and any quoting rules are decisions only you can make.

```ts
function escapeTsvValue(value: unknown) {
  const text = value == null ? '' : String(value)
  // spreadsheets expect a quoted field once it contains a delimiter, a newline,
  // or a quote, with inner quotes doubled
  return /["\t\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
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

Because a reorder can widen a selection onto columns the user never picked, some applications prefer to clear the selection whenever the column layout changes. That is a userland decision, and one `useEffect` away:

```ts
// compare a layout key, then reset when it changes
const layoutKey = JSON.stringify([
  table.atoms.columnOrder.get(),
  table.atoms.columnPinning.get(),
  table.atoms.columnVisibility.get(),
])

if (layoutKey !== lastLayoutKey) {
  lastLayoutKey = layoutKey
  queueMicrotask(() => table.resetCellSelection(true))
}
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

Alpine re-renders from a version counter rather than tracking individual
reads, so every selection change re-evaluates the `x-for` that renders the rows.
That makes cell selection the feature most likely to make a large Alpine table
feel slow.

Measured on a table with a thousand rows and twelve columns, a drag updates in
roughly 160ms per move. The same table is around 12-19ms per move on the
signal-based adapters. Almost all of that difference is Alpine re-rendering rows,
not the selection reads themselves: `cell.getIsSelected()` resolves the cell's
row and column index and compares them against a memoized cache of the selection
bounds, which is a handful of integer comparisons.

There is no fine-grained subscription primitive to reach for here, so the
practical fix is to render fewer rows. Paginate the table, or keep the rendered
row count small, and cell selection stays responsive. Ranges are stored as row
and column ids resolved against the pre-pagination order, so a selection can
still span pages.
