---
name: row-selection
description: >
  Track which rows are selected in TanStack Table v9 via
  `rowSelection: Record<rowId, boolean | undefined>`. Covers `rowSelectionFeature`,
  the three selected-row APIs (`getSelectedRowModel`, `getFilteredSelectedRowModel`,
  `getGroupedSelectedRowModel`), `row.toggleSelected` / `getIsSelected` /
  `getIsSomeSelected` (indeterminate) / `getCanSelect` / `getCanMultiSelect`,
  `row.getToggleSelectedHandler`, header APIs (`getIsAllRowsSelected` /
  `getIsSomeRowsSelected` / `getToggleAllRowsSelectedHandler` and the page-aware
  variants), `enableRowSelection` (bool or predicate),
  `enableMultiRowSelection: false` for radio-style, `enableSubRowSelection`,
  and why `getRowId` is essentially mandatory — especially under server pagination.
type: core
library: tanstack-table
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - column-definitions
sources:
  - TanStack/table:docs/guide/row-selection.md
  - TanStack/table:packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts
  - TanStack/table:packages/table-core/src/features/row-selection/rowSelectionFeature.types.ts
  - TanStack/table:examples/react/row-selection/src/main.tsx
---

This skill builds on `tanstack-table/state-management` and `tanstack-table/column-definitions`. Read those first for state ownership and `getRowId`.

## Setup

```ts
import {
  tableFeatures,
  rowSelectionFeature,
  constructTable,
} from '@tanstack/table-core'
import type { RowSelectionState } from '@tanstack/table-core'

const features = tableFeatures({ rowSelectionFeature })

const table = constructTable({
  features,
  columns,
  data,
  getRowId: (row) => row.id, // ← essentially mandatory
  initialState: { rowSelection: {} satisfies RowSelectionState },
  enableRowSelection: true,
})
```

## Core Patterns

### Select column with header "select all" + per-row checkbox

```tsx
// From examples/react/row-selection/src/main.tsx
columnHelper.display({
  id: 'select',
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllRowsSelected()}
      indeterminate={table.getIsSomeRowsSelected()}
      onChange={table.getToggleAllRowsSelectedHandler()}
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      indeterminate={row.getIsSomeSelected()}
      disabled={!row.getCanSelect()}
      onChange={row.getToggleSelectedHandler()}
    />
  ),
}),
```

### Single-select (radio-style)

```tsx
const table = useTable({
  features: tableFeatures({ rowSelectionFeature }),
  columns,
  data,
  getRowId: (row) => row.id,
  enableMultiRowSelection: false, // ← radio-like
})

// Cell renders a radio, no "select all" header makes sense
columnHelper.display({
  id: 'select',
  header: '', // no select-all in single-select mode
  cell: ({ row }) => (
    <input
      type="radio"
      name="row-selection"
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onChange={row.getToggleSelectedHandler()}
    />
  ),
})
```

### Conditional selection per row

```ts
const table = useTable({
  features,
  columns,
  data,
  getRowId: (row) => row.id,
  enableRowSelection: (row) => row.original.age > 18, // predicate form
})
```

### Three selected-row APIs

```ts
table.getSelectedRowModel() // built off core — raw data
table.getFilteredSelectedRowModel() // built off filtered — current filters applied
table.getGroupedSelectedRowModel() // built off grouped — current groups applied
```

### Hoist selection to an external atom

```tsx
import { useCreateAtom } from '@tanstack/react-store'

const rowSelectionAtom = useCreateAtom<RowSelectionState>({})

const table = useTable({
  features,
  columns,
  data,
  getRowId: (row) => row.id,
  atoms: { rowSelection: rowSelectionAtom },
})

// Send selected IDs to an API call from a sibling component
function ExportButton() {
  const selection = useStore(rowSelectionAtom)
  return (
    <button onClick={() => api.export(Object.keys(selection))}>Export</button>
  )
}
```

## Common Mistakes

### [HIGH] Omitting `getRowId` under `manualPagination`

Wrong:

```ts
// Server-side pagination + default row.id = row.index
const table = useTable({
  features: tableFeatures({ rowSelectionFeature, rowPaginationFeature }),
  data, // only current page from server
  manualPagination: true,
  rowCount,
})
// After paging, rowSelection: { '5': true } is ambiguous
// — selection appears to move with the user.
```

Correct:

```ts
const table = useTable({
  features: tableFeatures({ rowSelectionFeature, rowPaginationFeature }),
  data,
  manualPagination: true,
  rowCount,
  getRowId: (row) => row.uuid, // stable across pages
})

// For "X of Y selected" with server-side pagination, read state directly:
const totalSelected = Object.keys(table.state.rowSelection).length
```

`row.id` defaults to `row.index`. Under `manualPagination`, every page reuses indices 0..n-1, so selection IDs collide across pages.

Source: docs/guide/row-selection.md; examples/react/row-selection/src/main.tsx

### [MEDIUM] `enableMultiRowSelection: false` + a "select all" checkbox header

Wrong:

```tsx
const table = useTable({
  features: tableFeatures({ rowSelectionFeature }),
  enableMultiRowSelection: false, // radio-like
})

// Header still renders a checkbox + indeterminate
<Checkbox
  checked={table.getIsAllRowsSelected()}
  indeterminate={table.getIsSomeRowsSelected()}
  onChange={table.getToggleAllRowsSelectedHandler()}
/>
```

Correct:

```tsx
const table = useTable({
  features: tableFeatures({ rowSelectionFeature }),
  enableMultiRowSelection: false,
  getRowId: (row) => row.id,
})

// Drop the toggle-all header in single-select mode
columnHelper.display({
  id: 'select',
  header: '',
  cell: ({ row }) => (
    <input
      type="radio"
      name="row-selection"
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onChange={row.getToggleSelectedHandler()}
    />
  ),
})
```

In single-select mode, `mutateRowIsSelected` clears all other ids before adding the new one. "Select all" becomes effectively no-op and indeterminate is meaningless.

Source: docs/guide/row-selection.md; packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts

### [HIGH] `getSelectedRowModel().flatRows` for counts under `manualPagination`

Wrong:

```ts
// Under manualPagination, only counts the visible page's selected rows
const selectedCount = table.getSelectedRowModel().flatRows.length

const handleBulkAction = () => {
  const ids = table.getSelectedRowModel().flatRows.map((row) => row.original.id)
  api.archive(ids) // missing all selections from other pages!
}
```

Correct:

```ts
// For counts and id lists under manualPagination, read state directly
const selectedCount = Object.keys(table.state.rowSelection).length

const handleBulkAction = () => {
  const ids = Object.keys(table.state.rowSelection)
  api.archive(ids)
}
// (Client-side: getSelectedRowModel is fine — data contains every row.)
```

`getSelectedRowModel` walks the core row model — which under `manualPagination` only contains the current page. `state.rowSelection` may contain ids that aren't in `data` (that's by design).

Source: docs/guide/row-selection.md; packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts

### [MEDIUM] Surprise sub-row propagation from `enableSubRowSelection` default

Wrong:

```ts
// Default behavior: clicking the parent selects all children
const table = useTable({
  features: tableFeatures({ rowSelectionFeature, rowExpandingFeature }),
  getSubRows: (row) => row.subRows,
  // enableSubRowSelection unset — defaults to true
})
```

Correct:

```ts
const table = useTable({
  features: tableFeatures({ rowSelectionFeature, rowExpandingFeature }),
  getSubRows: (row) => row.subRows,
  enableSubRowSelection: false, // toggling parent doesn't touch subRows
})

// Or selectively:
enableSubRowSelection: (row) => row.depth > 0,

// Indeterminate parent checkbox
<Checkbox
  checked={row.getIsSelected()}
  indeterminate={row.getIsSomeSelected()} // 'some' descendants selected
  disabled={!row.getCanSelect()}
  onChange={row.getToggleSelectedHandler()}
/>
```

`enableSubRowSelection: true` is the default. `mutateRowIsSelected` recurses into `row.subRows` when truthy. Decide deliberately — "select group as a whole" UX wants this off.

Source: docs/guide/row-selection.md; packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts

### [HIGH] Parent checkbox stuck "unchecked" with all sub-rows selected (deep trees)

Wrong:

```ts
// Returns false even when all leaf descendants are selected
const isParentChecked = row.getIsAllSubRowsSelected()
```

Correct:

```ts
const allLeafs = row.getLeafRows()
const allSelected =
  allLeafs.length > 0 && allLeafs.every((r) => r.getIsSelected())
const someSelected = allLeafs.some((r) => r.getIsSelected())
```

`getIsAllSubRowsSelected` only counts direct children. With multi-level grouping, a parent reports based on a partial count.

Source: https://github.com/TanStack/table/issues/4878; https://github.com/TanStack/table/issues/4759

### [HIGH] Stale rowSelection IDs after data refresh

Wrong:

```ts
useEffect(() => {
  refreshData() // selection still references deleted IDs
}, [trigger])
```

Correct:

```ts
useEffect(() => {
  setRowSelection((prev) => {
    const validIds = new Set(data.map((row) => row.id))
    const next: RowSelectionState = {}
    for (const id in prev) if (validIds.has(id)) next[id] = prev[id]
    return next
  })
}, [data])
```

v8 removed v7's `autoResetSelectedRows`. With websockets / refetch, IDs that no longer exist remain in `rowSelection` and `getIsAllRowsSelected()` returns true based on stale state. Prune yourself.

Source: https://github.com/TanStack/table/issues/5850; https://github.com/TanStack/table/issues/4498

### [CRITICAL] Reimplementing selection state manually

Wrong:

```ts
// Hand-rolled "selected" set, bypassing the table
const [selected, setSelected] = useState(new Set<string>())
const toggle = (id: string) => {
  setSelected((s) => {
    const next = new Set(s)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
}
```

Correct:

```ts
const table = useTable({
  features: tableFeatures({ rowSelectionFeature }),
  columns,
  data,
  getRowId: (row) => row.id,
})
row.toggleSelected()
row.toggleSelected(true)
table.toggleAllRowsSelected()
table.setRowSelection({ abc: true })
```

Source: maintainer interview (Phase 4, 2026-05-17)

## See also

- `tanstack-table/column-definitions` — `getRowId` is the foundation of every row-keyed feature
- `tanstack-table/state-management` — `rowSelection` slice + atoms for sharing selection
- `tanstack-table/pagination` — server-pagination "select all" pitfalls
- `tanstack-table/grouping` — `getGroupedSelectedRowModel` distinction
