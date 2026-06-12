---
title: Row Pinning (Preact) Guide
---

## Examples

Want to skip to the implementation? Check out these Preact examples:

- [Row Pinning](../examples/row-pinning)
### Preact Setup

```tsx
import { useTable, tableFeatures, rowPinningFeature } from '@tanstack/preact-table'

const features = tableFeatures({ rowPinningFeature })

const table = useTable({
  features,
  columns,
  data,
})
```

## Row Pinning (Preact) Guide

Row pinning lets you keep selected rows in top or bottom row regions while the rest of the rows render in the center region.

There are 2 table features that can reorder rows, which happen in the following order:

1. **Row Pinning** - If pinning, rows are split into top, center (unpinned), and bottom pinned rows.
2. [Sorting](./sorting)

### Enable Row Pinning

To use row pinning, add `rowPinningFeature` to your features. Row pinning does not require a row model factory; add other row model factory slots to `tableFeatures` only if your table uses them.

```tsx
import {
  rowPinningFeature,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'

const features = tableFeatures({ rowPinningFeature })

const table = useTable({
  features,
  columns,
  data,
})
```

### Row Pinning State

The `rowPinning` state stores row IDs in `top` and `bottom` arrays:

```tsx
type RowPinningState = {
  top: string[]
  bottom: string[]
}
```

You can pin rows by default with `initialState.rowPinning`:

```tsx
const table = useTable({
  features,
  columns,
  data,
  initialState: {
    rowPinning: {
      top: ['0'],
      bottom: ['3'],
    },
  },
})
```

If you need to manage row pinning outside of the table instance, the recommended v9 approach is an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the pinning state without re-rendering the component that owns the table.

```tsx
import { useCreateAtom, useSelector } from '@tanstack/preact-store'
import type { RowPinningState } from '@tanstack/preact-table'

const rowPinningAtom = useCreateAtom<RowPinningState>({
  top: [],
  bottom: [],
})

const rowPinning = useSelector(rowPinningAtom) // subscribe wherever it is needed

const table = useTable({
  features,
  columns,
  data,
  atoms: {
    rowPinning: rowPinningAtom,
  },
})
```

Alternatively, the v8-style `state.rowPinning` plus `onRowPinningChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```tsx
const [rowPinning, setRowPinning] = useState<RowPinningState>({
  top: [],
  bottom: [],
})

const table = useTable({
  features,
  columns,
  data,
  state: {
    rowPinning,
  },
  onRowPinningChange: setRowPinning,
})
```

Use `table.setRowPinning` to update the state directly, and `table.resetRowPinning` to reset it to `initialState.rowPinning`. Pass `true` to `resetRowPinning` to clear both pinned row arrays.

```tsx
table.setRowPinning({
  top: ['0', '2'],
  bottom: ['8'],
})

table.resetRowPinning()
table.resetRowPinning(true)
```

### Pin Rows With Row APIs

Each row exposes APIs for checking whether it can be pinned, reading its pinned position, and changing its pinned position.

```tsx
row.getCanPin()
row.getIsPinned() // 'top', 'bottom', or false
row.getPinnedIndex()

row.pin('top')
row.pin('bottom')
row.pin(false)
```

You can use these APIs to build pinning controls:

```tsx
const columns = [
  {
    id: 'pin',
    header: 'Pin',
    cell: ({ row }) =>
      row.getCanPin() ? (
        <div>
          <button onClick={() => row.pin('top')} disabled={row.getIsPinned() === 'top'}>
            Top
          </button>
          <button onClick={() => row.pin(false)} disabled={!row.getIsPinned()}>
            Center
          </button>
          <button onClick={() => row.pin('bottom')} disabled={row.getIsPinned() === 'bottom'}>
            Bottom
          </button>
        </div>
      ) : null,
  },
  //...
]
```

The `row.pin` API also accepts `includeLeafRows` and `includeParentRows` flags. These can be useful when pinning grouped or expanded rows and deciding whether related parent or leaf rows should move with the row.

### Row Pinning Table APIs

Row pinning splits the current row model into 3 row lists:

```tsx
table.getTopRows()
table.getCenterRows()
table.getBottomRows()
```

If you render pinned rows in separate table sections, use those APIs directly:

```tsx
<tbody>
  {table.getTopRows().map(row => (
    <PinnedRow key={row.id} row={row} />
  ))}
  {table.getCenterRows().map(row => (
    <TableRow key={row.id} row={row} />
  ))}
  {table.getBottomRows().map(row => (
    <PinnedRow key={row.id} row={row} />
  ))}
</tbody>
```

Use `table.getIsSomeRowsPinned()` to check whether any rows are pinned, or pass a position to check a specific pinned region.

```tsx
table.getIsSomeRowsPinned()
table.getIsSomeRowsPinned('top')
table.getIsSomeRowsPinned('bottom')
```

### Disable Row Pinning

By default, all rows can be pinned. You can disable row pinning for the whole table or decide per row with `enableRowPinning`.

```tsx
const table = useTable({
  features,
  columns,
  data,
  enableRowPinning: row => row.original.status !== 'archived',
})
```

### Keep Pinned Rows

By default, `keepPinnedRows` is `true`, so pinned rows stay visible in their pinned region even when they would otherwise be filtered or paginated out of the center rows.

Set `keepPinnedRows` to `false` if pinned rows should only render when they are present in the current filtered and paginated row model.

```tsx
const table = useTable({
  features,
  columns,
  data,
  keepPinnedRows: false,
})
```
