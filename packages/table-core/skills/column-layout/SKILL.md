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
library_version: '9.0.0-alpha.48'
requires:
  - state-management
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

const features = tableFeatures({
  columnVisibilityFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnResizingFeature, // explicit — formerly part of v8 ColumnSizing
})

const table = constructTable({
  features,
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

| Feature                   | State slice            | Key APIs                                             |
| ------------------------- | ---------------------- | ---------------------------------------------------- |
| `columnVisibilityFeature` | `columnVisibility`     | `column.toggleVisibility()`, `row.getVisibleCells()` |
| `columnOrderingFeature`   | `columnOrder`          | `table.setColumnOrder()`, `column.getIndex()`        |
| `columnPinningFeature`    | `columnPinning` (l/r)  | `column.pin()`, `column.getStart()`, `getAfter()`    |
| `columnSizingFeature`     | `columnSizing`         | `column.getSize()`, `table.getTotalSize()`           |
| `columnResizingFeature`   | (transient drag state) | `header.getResizeHandler()`, `columnResizeMode`      |

Full API surface, render strategies, and additional MEDIUM-priority failure modes (reorder-pinned-via-columnOrder, react-dnd/react-beautiful-dnd avoidance, touch-resize handler) in [subsystems.md](references/subsystems.md).

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
  features: tableFeatures({ columnSizingFeature, columnResizingFeature }),
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

### [HIGH] Using v8 `enablePinning` at the table level

Wrong:

```ts
// v8 syntax — no longer disables pinning at table level in v9
const table = useTable({
  features: tableFeatures({ columnPinningFeature }),
  enablePinning: false, // ignored
})
```

Correct:

```ts
// v9 split: two distinct table-level options
const table = useTable({
  features: tableFeatures({ columnPinningFeature, rowPinningFeature }),
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
    features: tableFeatures({ columnPinningFeature, columnResizingFeature }),
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
  const table = useTable({ features, columns, data })
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
  features: tableFeatures({ columnVisibilityFeature }),
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

## References

- [subsystems.md](references/subsystems.md) — full API surface per UI-state subsystem (visibility, ordering, pinning, sizing, resizing) plus MEDIUM-priority failure modes: reorder-pinned-via-`columnOrder`, react-dnd / react-beautiful-dnd avoidance, touch-resize handler
