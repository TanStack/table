---
title: Sparse Rows Guide
---

## What It Does

A remote table usually loads its rows from the start: the first page, then the second page, and so on. `data` cannot have gaps, so to show row 99,999 of 100,000 the app must first load every row before it.

`sparseRowsFeature` removes that limit. `data` holds only the rows that are loaded, each at its absolute index on the server, and `rowCount` is the total. The core row model then has `rowCount` rows, and each index without data gets a placeholder row. `table.getCoreRowModel().rows[i]` is always row `i` on the server, and so is `table.getRowModel().rows[i]` when the table does not cut pages or add expanded sub-rows. A virtualizer gets the correct scrollbar length, the user can jump to any position, and the app loads only the rows in view.

The table does not load data. It tells you which ranges are missing, and you load them, for example with [TanStack Query](https://tanstack.com/query/latest).

## When To Use It

- The server returns the total row count and can return rows by offset.
- Sorting and filtering run on the server (`manualSorting` and `manualFiltering`). The usual setup is a virtualized table that also sets `manualPagination`.
- Users must be able to jump to any position, for example by dragging the scrollbar of a virtualized table.

If the server only supports cursors, or cannot return a total, keep the [infinite scrolling pattern](./client-side-vs-server-side#cursor-based-pagination-with-useinfinitequery). If users only move page by page, normal [server-side pagination](./client-side-vs-server-side) is simpler.

## Quick Start

```ts
import {
  sparseRowsFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'

const features = tableFeatures({ sparseRowsFeature })

const table = useTable({
  features,
  columns,
  data: loadedRowsByIndex,
  rowCount: 100_000,
  getRowId: (row) => row.id,
})

table.getRowModel().rows.length // 100_000
table.getRowModel().rows[99_999].index // 99_999
table.getRowModel().rows[99_999].getIsPlaceholder() // true until the row is loaded
table.getMissingRowRanges({ startIndex: 99_950, endIndex: 99_999 })
// [{ startIndex: 99_950, endIndex: 99_999 }]
```

`sparseRowsFeature` is exported from every framework adapter and from `@tanstack/table-core`. It is not part of `stockFeatures`, because it changes how the table reads `data` and `rowCount`. Register it by name.

The broad `Table<any, any>` and `Row<any, any>` types do not include the API of this feature. Use the type of your `features` object, for example `Row<typeof features, Person>`, to call `row.getIsPlaceholder()`.

## Put Loaded Rows at Their Index

`data` is a sparse array. Put each loaded row at the index that it has on the server:

```ts
const data: Array<Person> = []

for (const block of loadedBlocks) {
  block.rows.forEach((row, offset) => {
    data[block.startIndex + offset] = row
  })
}
```

- A row is missing when its entry in `data` is a hole or `undefined`, or when its index is `data.length` or more.
- `rowCount` is the total number of rows. Without it, the table uses `data.length`. Rows in `data` at index `rowCount` or more are ignored.
- The table builds the core row model again for each new `data` array. This work grows with `rowCount`. Placeholder rows are made only once, so a new block costs much less than the first build. Make a new array only when rows arrive or leave, not on each render.
- To limit memory, you can remove rows that are far from the viewport. They become placeholder rows again.

## Render Placeholder Rows

A placeholder row is a normal row object. It has the server `index` and the same cells as a loaded row, so it can render a skeleton with the correct column layout:

```tsx
const rows = table.getRowModel().rows

virtualRows.map((virtualRow) => {
  const row = rows[virtualRow.index]

  return row.getIsPlaceholder() ? (
    <SkeletonRow key={row.id} row={row} />
  ) : (
    <DataRow key={row.id} row={row} />
  )
})
```

A placeholder row has no data:

- `row.original` is `undefined`. Its type is still `TData`, so check `row.getIsPlaceholder()` before you read it.
- `row.getValue()` and `cell.getValue()` return `undefined`. The table does not call the column accessors.
- Do not render the `cell` templates of your columns for a placeholder row if they read `row.original`.
- `row.id` is temporary. It starts with `__placeholder_`, holds only the index of the row, and changes to the `getRowId` result when the row is loaded. Do not store it.
- The `__placeholder_` prefix is reserved. `getRowId` must not return an ID that starts with it, or the table can mistake the loaded row for a placeholder row. In development, the table logs a warning for such an ID.

## Load the Missing Ranges

`table.getMissingRowRanges({ startIndex, endIndex })` returns the ranges that `data` has no rows for. Both bounds are included, and the table limits them to the rows that exist. Call it with the visible range when the user scrolls:

```ts
const BLOCK_SIZE = 50

function loadVisibleRows(startIndex: number, endIndex: number) {
  const ranges = table.getMissingRowRanges({
    startIndex,
    endIndex,
    blockSize: BLOCK_SIZE,
  })

  for (const range of ranges) {
    // Your code: request the rows, then put them into `data` by index.
    loadBlock(range.startIndex, range.endIndex)
  }
}
```

Without `blockSize`, the result is the exact gaps: `[{ startIndex: 120, endIndex: 160 }]`.

With `blockSize`, the result has one range for each block that has a missing row in the requested range. Block `n` starts at index `n * blockSize`, so the same block always has the same bounds: `[{ startIndex: 100, endIndex: 149 }, { startIndex: 150, endIndex: 199 }]`. This makes `range.startIndex` a stable cache key, for example `queryKey: ['people', sorting, columnFilters, range.startIndex]`. A block range can be larger than the requested range, but it never goes past the last row.

A block stays missing until its rows are in `data`, so the same range can be returned again while its request is in progress. Use the cache key to make each request only once.

`getMissingRowRanges` reads `data` directly. Its cost depends on the size of the requested range, not on `rowCount`.

## Sorting and Filtering Change the Index Space

Row 99,999 under one sort order is a different row under another sort order. The loaded rows are only correct for the sorting and filters that they were loaded with.

- Sort, filter, and group on the server. Set `manualSorting`, `manualFiltering`, and `manualGrouping`, or do not register the client-side row models. A client-side row model only sees the loaded rows, so its result is wrong. The table logs a warning in development when one is active and a row is not loaded. `manualPagination` is different: client-side pagination keeps the index space, see [Pagination](#pagination).
- When sorting or a filter changes, start again with an empty `data` array and the new `rowCount`. If you load blocks with TanStack Query, put the sorting and filter state into the query key.
- With this feature, a new `data` array does not run the `autoResetPageIndex`, `autoResetExpanded`, and other `autoReset*` behaviors, because a new array usually means that more rows are loaded. Reset the page index or the scroll position yourself when sorting or a filter changes.
- Do not let the table read column behavior from row values, because placeholder rows have no values. Set `sortDescFirst` on the table or on your columns; without it, the first sort direction of a column comes from the values of the first rows. If you use `column.getCanGlobalFilter()`, set `enableGlobalFilter: true` on the columns that the server can search; without it, the table reads the loaded rows until it finds a value, and the result is `false` while no row is loaded.

### Reset State When You Start Again

A placeholder ID holds only the index of its row. After you start again with a new `data` array, the same placeholder ID is a different row on the server. State that holds a placeholder ID then points at that different row.

- The table stores a placeholder ID in one state only: the focused cell of `cellSelectionFeature`, while that cell is in a placeholder row. See [Cell Selection](#cell-selection). Call `table.resetCellSelection()` when you start again. If you do not, the focus stays at the same index, and the loaded row at that index has the focused cell and its selection.
- Row selection, row pinning, and expanding keep no state for a placeholder row, so they hold no placeholder ID.
- Do not put a placeholder ID into your own state, for example the ID of the row that a context menu is open for. If you must, reset that state when you start again.

## Pagination

`rowCount` is the same option that `rowPaginationFeature` reads for `table.getRowCount()` and `table.getPageCount()`. The table can show the rows in two ways:

- **All rows, for a virtualized table.** Set `manualPagination: true`, or do not register `paginatedRowModel`. The table cuts no pages, and `table.getRowModel().rows` has `rowCount` rows.
- **Pages cut on the client.** Register `paginatedRowModel` and leave `manualPagination` off. The paginated row model cuts each page out of the sparse row model, so page 2,000 shows placeholder rows until you load its range. `row.index` is still the server index, but `table.getRowModel().rows[0]` is the first row of the page.

This changes what normal server-side pagination means. Without this feature, `data` is the current page. With it, `data` is always indexed from row 0, so a `data` array that holds one page means that rows `0` to `pageSize - 1` are loaded and all other rows are placeholder rows. Put each page at its index, as shown in [Put Loaded Rows at Their Index](#put-loaded-rows-at-their-index).

### `rowCount` Is Also the Total

`rowCount` has two jobs. It is the length of the sparse row model, and it is the total that other features read: `table.getRowCount()` and `table.getPageCount()` of `rowPaginationFeature`, and each feature or app code that calculates a count from the total, such as "all rows minus the deselected rows" for a "select all" on the server.

Set `rowCount` to the exact total of the server. If the total is not known and you set `rowCount` to more than the rows that you know of, to get placeholder rows after the last loaded row, each of these features reads the padded number. Do not show their counts as a total then, and set the exact `rowCount` when you get it.

## Row Selection, Pinning, and Expanding

Row state is stored by row ID, and a placeholder row only has a temporary ID. The table keeps no state for it:

- `getCanSelect()`, `getCanMultiSelect()`, `getCanPin()`, and `getCanExpand()` return `false`, and `getIsExpanded()` returns `false`. Option callbacks such as `enableRowSelection` and `getRowCanExpand` are not called with a placeholder row.
- `toggleSelected()`, `pin()`, and `toggleExpanded()` do nothing.
- `toggleAllRowsSelected()` selects the loaded rows only, and `getIsAllRowsSelected()` is about the loaded rows.

The state of a loaded row stays when you remove the row from `data`. The row is selected, pinned, or expanded again when it is loaded again. `getSelectedRowModel()`, `getTopRows()`, and `getBottomRows()` contain loaded rows only. `getIsAllRowsSelected()` returns `false` while no row is loaded.

## Cell Selection

`cellSelectionFeature` stores the two corners of each range by row ID, so a placeholder row cannot be a corner of a range. The focused cell is different. It can be in a placeholder row, so the user can move with the keyboard into rows that are not loaded.

- `cell.getCanSelect()` returns `false` for the cells of a placeholder row, and their selection handlers do nothing. The `enableCellSelection` callback is not called with such a cell.
- `moveCellSelection()` moves the focus onto a placeholder row as it does onto a loaded row. `setFocusedCell()` also accepts the ID of a placeholder row, for example to jump to the last row.
- While the focused cell is in a placeholder row, no cell is selected. `cell.getIsFocused()` returns `true` and `cell.getTabIndex()` returns `0` for that cell, and `cell.getIsSelected()` returns `false`.
- When the row of the focused cell is loaded, the focus follows the row. `table.getFocusedCell()` returns the cell of the loaded row at the same index and in the same column. This cell is then selected, like the focused cell of any loaded row.
- `extendCellSelection()` stops at the last loaded row, so a range does not grow onto a placeholder row. It does nothing while the focused cell is in a placeholder row. A range event on a loaded cell, which is a Shift click by default, then starts a new selection at that cell.
- `selectCellRange()` ignores a range that starts or ends on a placeholder row, unless the range is one cell. `setCellSelection()` removes such a range from the new state.
- `selectAllCells()` selects from the first loaded row to the last loaded row.

The table does not load rows when the focus moves. Use the index of the focused row to load the rows around it:

```ts
table.moveCellSelection('down')

const focusedRow = table.getFocusedCell()?.row

if (focusedRow?.getIsPlaceholder()) {
  loadVisibleRows(focusedRow.index, focusedRow.index)
}
```

While the focused cell is in a placeholder row, the last range in the `cellSelection` state is that one cell, and it holds the placeholder ID of the row. This is the only state in which the table stores a placeholder ID. The table reads this ID as "the row at this index". The ID stays in the state after the row is loaded. The next change of the cell selection replaces it with the ID of the loaded row. Call `table.getFocusedCell()` to get the row that has the focus now. See also [Reset State When You Start Again](#reset-state-when-you-start-again).

A range can span rows that are not loaded. Its corners are loaded rows, and the placeholder rows between them are not selected: `getSelectedCellIds()`, `getSelectedCellCount()`, and `getCellSelectionRowIds()` leave them out. `getSelectedCellRangesData()` keeps the position of each row, so the grid of a range has an empty entry for each placeholder row; skip these entries when you copy the data. The rows become part of the selection when they are loaded. A range whose corner row is removed from `data` stays in state and selects nothing until that row is loaded again.

## Offset Drift

If rows are added or removed on the server between two requests, the blocks no longer fit together. They overlap or leave a gap, and the same row can be at two indexes. In development, the table logs a warning when `getRowId` returns the same ID for two loaded rows.

If your data changes often, send a snapshot or cursor ID with each block request so that all blocks come from the same version of the data, or load the blocks again when you see the warning.

## Constraints and Behavior

- A custom `coreRowModel` slot replaces the sparse row model. The table then makes no placeholder rows.
- `getSubRows` is read for loaded rows only. Sub-rows are not part of the server index space.
- `data` has the type `ReadonlyArray<TData>`, so build it with holes as shown above. `undefined` entries are also read as missing rows.
