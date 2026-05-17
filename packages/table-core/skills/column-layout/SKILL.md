---
name: column-layout
description: >
  The five UI-state-only column features in TanStack Table v9 that shape how
  columns render — visibility, ordering, pinning, sizing, resizing. None
  require a row model. Covers `columnVisibilityFeature` (getVisibleLeafColumns,
  row.getVisibleCells), `columnOrderingFeature` (columnOrder string[], column.getIndex),
  `columnPinningFeature` (left/right ColumnPinningState, column.pin, column.getStart /
  getAfter, split-table getLeft*/getCenter*/getRight* APIs, sticky-CSS pattern;
  `enableColumnPinning` table-level option distinct from per-column `enablePinning`),
  `columnSizingFeature` (defaultColumnSizing, column.getSize, table.getTotalSize),
  `columnResizingFeature` (columnResizeMode 'onEnd'/'onChange', columnResizeDirection
  'ltr'/'rtl', header.getResizeHandler for mouse + touch, CSS-variable
  performant resize pattern). Pipeline: Column Pinning → columnOrder → Grouping.
type: core
library: tanstack-table
library_version: '9.0.0-alpha.47'
requires:
  - tanstack-table/state-management
sources:
  - TanStack/table:docs/guide/column-visibility.md
  - TanStack/table:docs/guide/column-ordering.md
  - TanStack/table:docs/guide/column-pinning.md
  - TanStack/table:docs/guide/column-sizing.md
  - TanStack/table:docs/guide/column-resizing.md
  - TanStack/table:examples/react/column-visibility/src/main.tsx
  - TanStack/table:examples/react/column-resizing/src/main.tsx
  - TanStack/table:examples/react/column-resizing-performant/src/main.tsx
  - TanStack/table:examples/react/column-pinning-split/src/main.tsx
  - TanStack/table:examples/react/column-pinning-sticky/src/main.tsx
  - TanStack/table:examples/react/column-dnd/src/main.tsx
---

This skill builds on `tanstack-table/state-management`. Read it first for the atom model — these are UI-state-only features (no row model).

## Setup

All five features are opt-in via `tableFeatures({...})`. The reorder pipeline is fixed: **(1) Column Pinning splits into left/center/right → (2) `columnOrder` reorders the center → (3) Grouping (`groupedColumnMode: 'reorder' | 'remove'`) may move grouped columns to the front.**

```ts
import {
  tableFeatures,
  columnVisibilityFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnResizingFeature,
  constructTable,
} from '@tanstack/table-core'

const _features = tableFeatures({
  columnVisibilityFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnResizingFeature, // explicit — formerly part of v8 ColumnSizing
})

const table = constructTable({
  _features,
  _rowModels: {}, // no row model needed for these features
  columns,
  data,
  initialState: {
    columnVisibility: {},
    columnOrder: [],
    columnPinning: { left: [], right: [] },
    columnSizing: {},
  },
})
```

## Subsystems

### Visibility

State: `columnVisibility: Record<columnId, boolean>` — missing or `true` means visible.

```tsx
// Visibility toggle panel
{
  table.getAllLeafColumns().map((column) => (
    <label key={column.id}>
      <input
        type="checkbox"
        checked={column.getIsVisible()}
        disabled={!column.getCanHide()}
        onChange={column.getToggleVisibilityHandler()}
      />
      {column.id}
    </label>
  ))
}

// Body — use Visible variants, NOT getAllLeafColumns / getAllCells
;<tbody>
  {table.getRowModel().rows.map((row) => (
    <tr key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id}>
          <table.FlexRender cell={cell} />
        </td>
      ))}
    </tr>
  ))}
</tbody>
```

### Ordering

State: `columnOrder: string[]` of leaf column ids. Empty means definition order. **Scoped to UNPINNED columns** when pinning is active — pinned columns are sequenced inside `columnPinning.left/right`.

```ts
table.setColumnOrder(['firstName', 'lastName', 'age'])
column.getIndex('center') // ← position
column.getIsFirstColumn()
column.getIsLastColumn()
```

For drag-and-drop with `@dnd-kit/core`, see the "Common Mistakes" entry on dnd libraries below — `DndContext` must wrap from OUTSIDE the `<table>`.

### Pinning

State: `columnPinning: { left: string[]; right: string[] }`. Two render strategies:

```tsx
// Strategy A — split tables
<thead>
  {table.getLeftHeaderGroups().map(/* … */)}
</thead>
// + getCenterHeaderGroups / getRightHeaderGroups
// + row.getLeftVisibleCells / getCenterVisibleCells / getRightVisibleCells

// Strategy B — single table + sticky CSS
<th
  key={header.id}
  style={{
    position: header.column.getIsPinned() ? 'sticky' : undefined,
    left: header.column.getIsPinned() === 'left' ? `${header.column.getStart('left')}px` : undefined,
    right: header.column.getIsPinned() === 'right' ? `${header.column.getAfter('right')}px` : undefined,
  }}
>
  ...
</th>

// Toggle a pin programmatically
column.pin('left')  // or 'right' | false
```

### Sizing

State: `columnSizing: Record<columnId, number>` (pixels). Defaults via `defaultColumnSizing` ({ size: 150, minSize: 20, maxSize: Number.MAX_SAFE_INTEGER }) or `tableOptions.defaultColumn` globally.

```ts
columnHelper.accessor('firstName', {
  size: 200,
  minSize: 80,
  maxSize: 400,
})

// Reads
column.getSize() // committed size (clamped)
header.getSize() // same, for groups sums children
table.getTotalSize()
table.getCenterTotalSize()
column.resetSize() // drop the override
```

### Resizing

```tsx
// Wire BOTH onMouseDown AND onTouchStart on the resize handle
<div
  onDoubleClick={() => header.column.resetSize()}
  onMouseDown={header.getResizeHandler()}
  onTouchStart={header.getResizeHandler()}
  className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
/>

// Modes:
// columnResizeMode: 'onEnd' (default) — commit on drag release; safer for big React tables
// columnResizeMode: 'onChange'        — commit live; needs the perf pattern below
// columnResizeDirection: 'ltr' (default) | 'rtl'
```

## Core Patterns

### Performant `'onChange'` resize (React)

```tsx
// From examples/react/column-resizing-performant/src/main.tsx
const columnSizeVars = React.useMemo(() => {
  const headers = table.getFlatHeaders()
  const colSizes: { [key: string]: number } = {}
  for (const header of headers) {
    colSizes[`--header-${header.id}-size`] = header.getSize()
    colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
  }
  return colSizes
}, [table.state.columnResizing, table.state.columnSizing])

<div className="divTable" style={{ ...columnSizeVars, width: table.getTotalSize() }}>
  {table.store.state.columnResizing.isResizingColumn
    ? <MemoizedTableBody table={table} />
    : <TableBody table={table} />}
</div>

// Body cells use the CSS variable (no per-cell getSize() call)
<div className="td" style={{ width: `calc(var(--col-${cell.column.id}-size) * 1px)` }}>
  {cell.renderValue()}
</div>

export const MemoizedTableBody = React.memo(
  TableBody,
  (prev, next) => prev.table.options.data === next.table.options.data,
)
```

## Common Mistakes

### [HIGH] Rendering body cells with `row.getAllCells()` while visibility is registered

Wrong:

```tsx
// Toggling visibility has no effect on rendered cells
{
  table.getAllLeafColumns().map((column) => <th key={column.id}>...</th>)
}
{
  row.getAllCells().map((cell) => (
    <td key={cell.id}>
      <table.FlexRender cell={cell} />
    </td>
  ))
}
```

Correct:

```tsx
// Header groups already respect visibility; use them for headers.
// For body cells, swap getAllCells → getVisibleCells.
<thead>
  {table.getHeaderGroups().map((headerGroup) => (
    <tr key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <th key={header.id} colSpan={header.colSpan}>
          {header.isPlaceholder ? null : <table.FlexRender header={header} />}
        </th>
      ))}
    </tr>
  ))}
</thead>
<tbody>
  {table.getRowModel().rows.map((row) => (
    <tr key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id}><table.FlexRender cell={cell} /></td>
      ))}
    </tr>
  ))}
</tbody>
```

The `getAll*` accessors do NOT consult `columnVisibility` state. Only `Visible` variants and header-group APIs filter by visibility.

Source: docs/guide/column-visibility.md; examples/react/column-visibility/src/main.tsx

### [HIGH] `columnResizeMode: 'onChange'` + `column.getSize()` per cell + un-memoized body

Wrong:

```tsx
const table = useTable({
  _features: tableFeatures({ columnSizingFeature, columnResizingFeature }),
  columnResizeMode: 'onChange',
})
<td style={{ width: cell.column.getSize() }}>{cell.renderValue()}</td>
```

Correct:

```tsx
// See "Performant 'onChange' resize" above — CSS variables + memoized body
const columnSizeVars = React.useMemo(() => {
  /* … */
}, [table.state.columnResizing, table.state.columnSizing])

{
  table.store.state.columnResizing.isResizingColumn ? (
    <MemoizedTableBody table={table} />
  ) : (
    <TableBody table={table} />
  )
}

;<div
  className="td"
  style={{ width: `calc(var(--col-${cell.column.id}-size) * 1px)` }}
/>
```

`'onChange'` commits a new `columnSizing` map on every pointer move. Per-cell `getSize()` blows the 16ms frame budget. The CSS-variable pattern caches widths once per resize batch.

Source: docs/guide/column-resizing.md; examples/react/column-resizing-performant/src/main.tsx

### [MEDIUM] Trying to reorder pinned columns via `columnOrder`

Wrong:

```ts
// Won't move 'actions' relative to 'firstName' while it's pinned right
const [columnPinning] = useState({
  left: ['select'],
  right: ['actions'],
})
table.setColumnOrder(['actions', 'select', 'firstName', 'lastName'])
```

Correct:

```ts
// Reorder the pinning state itself
table.setColumnPinning((old) => ({
  left: ['select'],
  right: ['summary', 'actions'], // 'summary' renders before 'actions'
}))

// columnOrder works normally for the unpinned center region
table.setColumnOrder(['firstName', 'lastName'])
```

After the pipeline's pinning split, the left/right partitions read directly from `state.columnPinning.left/right`. `columnOrder` only affects the center.

Source: docs/guide/column-ordering.md; packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts

### [HIGH] Using v8 `enablePinning` at the table level

Wrong:

```ts
// v8 syntax — no longer disables pinning at table level in v9
const table = useTable({
  _features: tableFeatures({ columnPinningFeature }),
  enablePinning: false, // ignored
})
```

Correct:

```ts
// v9 split: two distinct table-level options
const table = useTable({
  _features: tableFeatures({ columnPinningFeature, rowPinningFeature }),
  enableColumnPinning: false,
  enableRowPinning: false,
})

// Per-column opt-out is still spelled `enablePinning`:
columnHelper.accessor('id', {
  enablePinning: false, // this column can't be pinned
})
```

v9 split `enablePinning` into `enableColumnPinning` and `enableRowPinning`. The bare name now refers ONLY to per-column opt-out.

Source: packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts

### [MEDIUM] Using `react-dnd` / `react-beautiful-dnd` for column reorder in React 18+

Wrong:

```tsx
// react-dnd in React 18 Strict Mode — flicker and stale drags
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// or nesting DndContext inside <table>
;<table>
  <DndContext onDragEnd={handleDragEnd}>
    <thead>...</thead>
  </DndContext>
</table>
```

Correct:

```tsx
// @dnd-kit + wrap from OUTSIDE the table (DndContext renders divs)
<DndContext
  collisionDetection={closestCenter}
  modifiers={[restrictToHorizontalAxis]}
  onDragEnd={handleDragEnd}
  sensors={sensors}
>
  <table>
    <thead>
      {table.getHeaderGroups().map((hg) => (
        <tr key={hg.id}>
          <SortableContext
            items={table.store.state.columnOrder}
            strategy={horizontalListSortingStrategy}
          >
            {hg.headers.map((h) => (
              <DraggableHeader key={h.id} header={h} />
            ))}
          </SortableContext>
        </tr>
      ))}
    </thead>
  </table>
</DndContext>
```

`react-dnd` has Strict Mode incompatibilities; `react-beautiful-dnd` is in maintenance. dnd-kit is the v9-recommended stack.

Source: examples/react/column-dnd/src/main.tsx

### [MEDIUM] Wiring `header.getResizeHandler()` to only `onMouseDown`

Wrong:

```tsx
// Desktop only — mobile users can't resize
<div onMouseDown={header.getResizeHandler()} />
```

Correct:

```tsx
<div
  onDoubleClick={() => header.column.resetSize()}
  onMouseDown={header.getResizeHandler()}
  onTouchStart={header.getResizeHandler()}
  className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
/>
```

`header_getResizeHandler` branches internally on `isTouchStartEvent`. The same handler must be installed on both DOM events.

Source: docs/guide/column-resizing.md; examples/react/column-resizing/src/main.tsx

### [HIGH] Defining `columns` inline (infinite loop once a layout feature commits state)

Wrong:

```tsx
function App() {
  const columns = [
    columnHelper.accessor('firstName', {
      /* … */
    }),
    columnHelper.accessor('lastName', {
      /* … */
    }),
  ]
  const table = useTable({
    _features: tableFeatures({ columnPinningFeature, columnResizingFeature }),
    columns,
    data,
  })
}
```

Correct:

```tsx
const defaultColumns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    /* … */
  }),
  columnHelper.accessor('lastName', {
    /* … */
  }),
])
function App() {
  const [columns] = React.useState(() => [...defaultColumns])
  const table = useTable({ _features, columns, data })
}

// or: useMemo
const columns = React.useMemo(
  () =>
    columnHelper.columns([
      /* … */
    ]),
  [],
)
```

Layout features commit state on every interaction. An inline `columns` array gets a new identity each render → table rebuild → another render. FAQ Pitfall 1.

Source: docs/faq.md; examples/react/column-pinning-split/src/main.tsx; examples/react/column-dnd/src/main.tsx

### [CRITICAL] Reimplementing visibility / pinning / resize logic manually

Wrong:

```ts
// Hand-rolled hide/show with a separate set
const [hidden, setHidden] = useState(new Set<string>())
const visibleColumns = useMemo(
  () => columns.filter((c) => !hidden.has(c.id)),
  [columns, hidden],
)
```

Correct:

```ts
const table = useTable({
  _features: tableFeatures({ columnVisibilityFeature }),
  _rowModels: {},
  columns,
  data,
})
column.toggleVisibility()
column.getIsVisible()
table.getVisibleLeafColumns()
```

Source: maintainer interview (Phase 4, 2026-05-17)

## See also

- `tanstack-table/state-management` — `state.columnVisibility` / `columnOrder` / `columnPinning` / `columnSizing` slices
- `tanstack-table/row-pinning` — analogous pinning for rows (different render pipeline)
- `tanstack-table/grouping` — `groupedColumnMode` interacts with `columnOrder`
