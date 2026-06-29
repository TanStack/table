---
name: row-pinning
description: >
  Pin specific rows to a top or bottom region in TanStack Table v9. State shape
  is `rowPinning: { top: string[]; bottom: string[] }` keyed by `row.id`. Covers
  `rowPinningFeature`, `row.pin(position, includeLeafRows?, includeParentRows?)`,
  `row.getIsPinned` / `getPinnedIndex` / `getCanPin`, `table.getTopRows` /
  `getBottomRows` / `getCenterRows` / `getIsSomeRowsPinned`, the
  `enableRowPinning` option (bool or row predicate), and `keepPinnedRows`
  (default true — persist across pagination/filtering vs. hide when filtered out).
  Simpler pipeline than column pinning — only one reorder step: Row Pinning →
  Sorting.
type: core
library: tanstack-table
library_version: '9.0.0-alpha.48'
requires:
  - state-management
sources:
  - TanStack/table:docs/guide/row-pinning.md
  - TanStack/table:packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts
  - TanStack/table:examples/react/row-pinning/src/main.tsx
---

This skill builds on `tanstack-table/state-management`. Read it first for the atom model.

## Setup

```ts
import {
  tableFeatures,
  rowPinningFeature,
  rowPaginationFeature,
  createPaginatedRowModel,
  constructTable,
} from '@tanstack/table-core'
import type { RowPinningState } from '@tanstack/table-core'

const features = tableFeatures({
  rowPinningFeature,
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

const table = constructTable({
  features,
  columns,
  data,
  getRowId: (row) => row.userId, // ← essentially mandatory
  initialState: {
    rowPinning: { top: [], bottom: [] } satisfies RowPinningState,
  },
})

// Pin a row
row.pin('top') // or 'bottom' | false
```

## Core Patterns

### Pin/unpin buttons in a cell

```tsx
// From examples/react/row-pinning/src/main.tsx
<button onClick={() => row.pin('top')} disabled={!row.getCanPin()}>📌⬆</button>
<button onClick={() => row.pin('bottom')} disabled={!row.getCanPin()}>📌⬇</button>
{row.getIsPinned() && <button onClick={() => row.pin(false)}>✖ Unpin</button>}
```

For grouped/expanded data, pass include flags:

```ts
row.pin('top', /* includeLeafRows */ true, /* includeParentRows */ false)
```

### Render pinned rows separately

```tsx
<tbody>
  {table.getTopRows().map((row) => (
    <PinnedRow key={row.id} row={row} table={table} />
  ))}
  {table.getCenterRows().map((row) => (
    <tr key={row.id}>
      {row.getAllCells().map((cell) => (
        <td key={cell.id}>
          <table.FlexRender cell={cell} />
        </td>
      ))}
    </tr>
  ))}
  {table.getBottomRows().map((row) => (
    <PinnedRow key={row.id} row={row} table={table} />
  ))}
</tbody>
```

### Disable persistence across pagination

```ts
const table = constructTable({
  features: tableFeatures({
    rowPinningFeature,
    columnFilteringFeature,
    filteredRowModel: createFilteredRowModel(),
    filterFns,
  }),
  columns,
  data,
  getRowId: (row) => row.id,
  keepPinnedRows: false, // pinned rows disappear when filtered/paginated out
})
```

`keepPinnedRows: true` (default) keeps pinned rows visible even when their underlying row would otherwise be filtered or paginated away.

### Conditional pin permission

```ts
const table = constructTable({
  features,
  columns,
  data,
  enableRowPinning: (row) => !row.original.archived, // predicate form
})
```

## Common Mistakes

### [HIGH] Omitting `getRowId` so pins attach to array indices

Wrong:

```ts
// row.id defaults to row.index; pin survives wrong rows after refetch
const table = useTable({
  features: tableFeatures({ rowPinningFeature, rowPaginationFeature }),
  data, // refetched periodically
})
```

Correct:

```ts
const table = useTable({
  features: tableFeatures({ rowPinningFeature, rowPaginationFeature }),
  data,
  getRowId: (row) => row.userId, // or row.uuid, row.id from API, etc.
})

// For grouped/expanded data, pass the include flags too:
row.pin('top', includeLeafRows, includeParentRows)
```

`rowPinning.top` and `rowPinning.bottom` are arrays of string row ids. Default `row.id` is the data array index — refetched data reuses index 3 for a different record, but the pinning state still pins index 3.

Source: docs/guide/row-selection.md (same root principle); examples/react/row-pinning/src/main.tsx

### [MEDIUM] Surprise behavior from `keepPinnedRows: true` default

Wrong:

```ts
// Expecting pinned rows to vanish on filter, but they don't (default)
const table = useTable({
  features: tableFeatures({ rowPinningFeature, columnFilteringFeature }),
  // keepPinnedRows defaults to true; pinned rows survive filtering
})
```

Correct:

```ts
// Be explicit about the UX you want
const table = useTable({
  features: tableFeatures({ rowPinningFeature, columnFilteringFeature }),
  keepPinnedRows: false, // pinned rows disappear when filtered/paginated out
})

// Or keep the default and render pinned separately:
<tbody>
  {table.getTopRows().map((row) => <PinnedRow row={row} key={row.id} />)}
  {table.getCenterRows().map((row) => <Row row={row} key={row.id} />)}
  {table.getBottomRows().map((row) => <PinnedRow row={row} key={row.id} />)}
</tbody>
```

`keepPinnedRows: true` makes `getTopRows()` / `getBottomRows()` search the full pre-pagination row set; `false` only finds rows currently in the row model.

Source: packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts; examples/react/row-pinning/src/main.tsx

### [MEDIUM] Rendering pinned rows TWICE (once at top/bottom, once in main flow)

Wrong:

```tsx
<tbody>
  {table.getTopRows().map((row) => (
    <PinnedRow row={row} key={row.id} />
  ))}
  {table.getRowModel().rows.map(
    (
      row, // ← still includes pinned rows
    ) => (
      <tr key={row.id}>...</tr>
    ),
  )}
  {table.getBottomRows().map((row) => (
    <PinnedRow row={row} key={row.id} />
  ))}
</tbody>
```

Correct:

```tsx
<tbody>
  {table.getTopRows().map((row) => (
    <PinnedRow key={row.id} row={row} table={table} />
  ))}
  {table.getCenterRows().map((row) => (
    <tr key={row.id}>
      {row.getAllCells().map((cell) => (
        <td key={cell.id}>
          <table.FlexRender cell={cell} />
        </td>
      ))}
    </tr>
  ))}
  {table.getBottomRows().map((row) => (
    <PinnedRow key={row.id} row={row} table={table} />
  ))}
</tbody>
```

`getRowModel()` returns the complete current row model with pinned rows still in it. Use `getCenterRows()` for the main flow. Use `getRowModel()` only if you intentionally want pinned rows duplicated.

Source: examples/react/row-pinning/src/main.tsx

### [CRITICAL] Reimplementing pin behavior manually

Wrong:

```ts
// Hand-rolled "pinned" map + manual filter on render
const [pinned, setPinned] = useState<Record<string, true>>({})
const pinnedRows = rows.filter((r) => pinned[r.id])
const otherRows = rows.filter((r) => !pinned[r.id])
```

Correct:

```ts
const table = useTable({
  features: tableFeatures({ rowPinningFeature }),
  columns,
  data,
  getRowId: (row) => row.id,
})

row.pin('top') // pin one row
table.setRowPinning({ top: ['a', 'b'], bottom: [] }) // bulk set
table.getTopRows()
table.getCenterRows()
table.getBottomRows()
```

Source: maintainer interview (Phase 4, 2026-05-17)

## See also

- `tanstack-table/state-management` — `rowPinning` state slice ownership
- `tanstack-table/row-selection` — same `getRowId` stability concern
- `tanstack-table/column-layout` — column pinning sits in a separate, more complex pipeline
