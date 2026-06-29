---
name: row-expanding
description: >
  Expand and collapse rows in TanStack Table v9 with the `expandedRowModel`
  stage. Two patterns: (1) tree sub-rows via `getSubRows`, (2) detail panels
  via `getRowCanExpand`. Covers `rowExpandingFeature` + `createExpandedRowModel()`,
  `state.expanded` (ExpandedState = true | Record<string, boolean>),
  `onExpandedChange`, `manualExpanding`, `paginateExpandedRows` (default true),
  `autoResetExpanded`, `row.toggleExpanded` / `getIsExpanded` / `getCanExpand` /
  `getIsAllParentsExpanded` / `getToggleExpandedHandler`, `table.toggleAllRowsExpanded`,
  `row.depth` for indentation, and the `filterFromLeafRows` /
  `maxLeafRowFilterDepth` interaction with filtering.
type: core
library: tanstack-table
library_version: '9.0.0-alpha.48'
requires:
  - state-management
sources:
  - TanStack/table:docs/guide/expanding.md
  - TanStack/table:packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts
  - TanStack/table:examples/react/expanding/src/main.tsx
  - TanStack/table:examples/react/sub-components/src/main.tsx
---

This skill builds on `tanstack-table/state-management`. Read it first for the atom model.

## Setup

```ts
import {
  tableFeatures,
  rowExpandingFeature,
  createExpandedRowModel,
  constructTable,
} from '@tanstack/table-core'
import type { ExpandedState } from '@tanstack/table-core'

const features = tableFeatures({
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
})

// Tree mode — data has nested subRows
const table = constructTable({
  features,
  columns,
  data,
  getSubRows: (row) => row.subRows,
  initialState: { expanded: {} satisfies ExpandedState },
})

// Or detail-panel mode — every row can expand to a sub-component
const detailTable = constructTable({
  features,
  columns,
  data,
  getRowCanExpand: () => true,
})
```

## Core Patterns

### Tree table with indentation

```tsx
// From examples/react/expanding/src/main.tsx
{
  row.getVisibleCells().map((cell, i) => (
    <td key={cell.id}>
      {i === 0 && row.getCanExpand() ? (
        <button
          onClick={row.getToggleExpandedHandler()}
          style={{ paddingLeft: `${row.depth * 2}rem` }}
        >
          {row.getIsExpanded() ? '👇' : '👉'}
        </button>
      ) : null}
      <table.FlexRender cell={cell} />
    </td>
  ))
}
```

`row.depth` is 0-based. `row.getCanExpand()` returns true when `row.subRows.length > 0`.

### Detail panels for flat data

```tsx
// From examples/react/sub-components/src/main.tsx
{
  table.getRowModel().rows.map((row) => (
    <React.Fragment key={row.id}>
      <tr>
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id}>
            <table.FlexRender cell={cell} />
          </td>
        ))}
      </tr>
      {row.getIsExpanded() && (
        <tr>
          <td colSpan={row.getVisibleCells().length}>
            <SubComponent row={row} />
          </td>
        </tr>
      )}
    </React.Fragment>
  ))
}
```

### Toggle ALL rows expanded at once

```tsx
<button onClick={table.getToggleAllRowsExpandedHandler()}>
  {table.getIsAllRowsExpanded() ? '👇' : '👉'} Toggle All
</button>
```

### Keep expanded children on their parent's page

```ts
const table = constructTable({
  features: tableFeatures({
    rowExpandingFeature,
    rowPaginationFeature,
    expandedRowModel: createExpandedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
  }),
  columns,
  data,
  getSubRows: (r) => r.subRows,
  paginateExpandedRows: false, // children stay glued to their parent
})
```

`paginateExpandedRows: true` (default) flows expanded children through pagination — each child counts toward `pageSize`. `false` keeps them stuck under their parent.

### Tree filtering with leaf-match propagation

```ts
const table = constructTable({
  features: tableFeatures({
    rowExpandingFeature,
    columnFilteringFeature,
    expandedRowModel: createExpandedRowModel(),
    filteredRowModel: createFilteredRowModel(),
    filterFns,
  }),
  columns,
  data,
  getSubRows: (r) => r.subRows,
  filterFromLeafRows: true, // keep parent visible when ANY descendant matches
})
```

## Common Mistakes

### [HIGH] Setting `getRowCanExpand: () => true` together with tree data

Wrong:

```ts
// every row gets an expander icon, including leaves with no subRows
const table = useTable({
  getRowCanExpand: () => true,
  getSubRows: (r) => r.subRows,
})
// In cell: row.getCanExpand() always true → leaf rows show 👉 with nothing to expand
```

Correct:

```ts
// For pure tree data, omit getRowCanExpand and let it auto-detect:
const table = useTable({
  features,
  columns,
  data,
  getSubRows: (row) => row.subRows,
  // row.getCanExpand() is true only when subRows.length > 0
})

// For pure detail panels, override and skip getSubRows:
const table = useTable({
  features: tableFeatures({
    rowExpandingFeature,
    expandedRowModel: createExpandedRowModel(),
  }),
  columns,
  data,
  getRowCanExpand: () => true,
})
```

`row_getCanExpand` resolves to `options.getRowCanExpand?.(row) ?? (enableExpanding ?? true) && !!row.subRows.length`. When `getRowCanExpand` is set, it wins — including for leaves.

Source: packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts

### [MEDIUM] Setting `paginateExpandedRows: false` and expecting `pageSize` to be a hard cap

Wrong:

```ts
const table = useTable({
  paginateExpandedRows: false,
  initialState: { pagination: { pageSize: 10 } },
  // user expands all parents → 10 parents * 5 children = 60 visible rows
})
```

Correct:

```ts
// Default behavior — children flow through pagination, pageSize is enforced:
const table = useTable({
  features,
  columns,
  data,
  getSubRows: (r) => r.subRows,
  // paginateExpandedRows defaults to true
})

// OR keep children with parent — accept that pageSize is a soft cap:
// paginateExpandedRows: false
```

`paginateExpandedRows: false` inflates each parent's page slice via `expandRows` — more rows render than `pageSize`. Pick deliberately.

Source: packages/table-core/src/features/row-pagination/createPaginatedRowModel.ts

### [MEDIUM] Storing `expanded` as `true` then writing into it like a Record

Wrong:

```ts
// spreading `true` (a boolean) into an object gives {} - all rows collapse except [id]
setExpanded((old) => ({ ...old, [row.id]: true }))
// When old === true, this becomes { [row.id]: true } — everything else collapses!
```

Correct:

```ts
// Prefer the built-in handler — it materializes properly:
<button onClick={row.getToggleExpandedHandler()}>
  {row.getIsExpanded() ? '👇' : '👉'}
</button>

// Or handle materialization yourself:
table.setExpanded((old) => {
  if (old === true) {
    const map: Record<string, boolean> = {}
    Object.keys(table.getRowModel().rowsById).forEach((id) => { map[id] = true })
    return { ...map, [row.id]: !map[row.id] }
  }
  return { ...old, [row.id]: !(old as Record<string, boolean>)[row.id] }
})
```

`ExpandedState = true | Record<string, boolean>`. The `true` literal means "all rows expanded" — `row.toggleExpanded` materializes it correctly before applying per-row changes.

Source: packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts

### [MEDIUM] `manualExpanding: true` with `expandedRowModel` registered

Wrong:

```ts
// manualExpanding bypasses the expanded row model; sub-rows are never flattened
const table = useTable({
  features: tableFeatures({
    rowExpandingFeature,
    expandedRowModel: createExpandedRowModel(), // ignored when manualExpanding: true
  }),
  columns,
  data,
  getSubRows: (r) => r.subRows,
  manualExpanding: true,
})
```

Correct:

```ts
// Manual expanding is for server-side patterns where the server returns
// a pre-flattened view based on which rows are expanded.
const table = useTable({
  features: tableFeatures({ rowExpandingFeature }),
  // no expandedRowModel registered for manual mode
  columns,
  data: dataQuery.data, // server returns flattened rows when expanded
  manualExpanding: true,
  state: { expanded },
  onExpandedChange: setExpanded,
})

// For client-side tree, omit manualExpanding:
const clientTable = useTable({
  features: tableFeatures({
    rowExpandingFeature,
    expandedRowModel: createExpandedRowModel(),
  }),
  columns,
  data,
  getSubRows: (r) => r.subRows,
})
```

With `manualExpanding: true`, `getExpandedRowModel` skips the registered factory and returns `getPreExpandedRowModel()` (sorted rows). The expanded state still tracks "which rows are open" but the row model is NOT inflated.

Source: packages/table-core/src/core/row-models/coreRowModelsFeature.utils.ts

### [CRITICAL] Reimplementing tree flattening manually

Wrong:

```ts
// Hand-rolled tree-to-flat conversion
const flatRows = useMemo(() => {
  const out: Person[] = []
  function walk(rows: Person[], depth = 0) {
    rows.forEach((r) => {
      out.push({ ...r, depth })
      if (expanded[r.id]) walk(r.subRows ?? [], depth + 1)
    })
  }
  walk(data)
  return out
}, [data, expanded])
```

Correct:

```ts
const table = useTable({
  features: tableFeatures({
    rowExpandingFeature,
    expandedRowModel: createExpandedRowModel(),
  }),
  columns,
  data,
  getSubRows: (r) => r.subRows,
})

// then: table.getRowModel().rows already has row.depth and the expanded view
table.getRowModel().rows.map((row) => /* render with row.depth */)
```

Source: maintainer interview (Phase 4, 2026-05-17)

## See also

- `tanstack-table/grouping` — pairs with expanding for drill-down on grouped rows
- `tanstack-table/pagination` — `paginateExpandedRows` interaction
- `tanstack-table/filtering` — `filterFromLeafRows` / `maxLeafRowFilterDepth` for tree filtering
