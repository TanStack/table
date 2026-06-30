---
title: Row Pinning (Alpine) Guide
---

## Examples

Want to skip to the implementation? Check out these Alpine examples:

- [Row Pinning](../examples/row-pinning)

Read your reactive inputs such as `data` through a getter (for example backing them with `Alpine.reactive`) when creating the table, so the table sees updates.

### Row Pinning Setup

Here's how you set up your table to use row pinning features. Adding the row pinning feature enables the related APIs.

```ts
import { createTable, tableFeatures, rowPinningFeature } from '@tanstack/alpine-table'

const features = tableFeatures({ rowPinningFeature })

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
})
```

## Row Pinning (Alpine) Guide

Row pinning lets you keep selected rows in top or bottom row regions while the rest of the rows render in the center region.

There are 2 table features that can reorder rows, which happen in the following order:

1. **Row Pinning** - If pinning, rows are split into top, center (unpinned), and bottom pinned rows.
2. [Sorting](./sorting)

### Enable Row Pinning

To use row pinning, add `rowPinningFeature` to your features. Row pinning does not require a row model factory.

```ts
import {
  rowPinningFeature,
  tableFeatures,
  createTable,
} from '@tanstack/alpine-table'

const features = tableFeatures({ rowPinningFeature })

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
})
```

### Row Pinning State

The `rowPinning` state stores row IDs in `top` and `bottom` arrays:

```ts
type RowPinningState = {
  top: string[]
  bottom: string[]
}
```

You can pin rows by default with `initialState.rowPinning`:

```ts
const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
  initialState: {
    rowPinning: {
      top: ['0'],
      bottom: ['3'],
    },
  },
})
```

If you need to manage row pinning outside of the table instance, the recommended v9 approach is an external atom passed to the table's `atoms` option. `@tanstack/store` is already a dependency of `@tanstack/alpine-table`, so `createAtom` is available. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the pinning state without going through the component that owns the table.

```ts
import { createAtom } from '@tanstack/store'
import type { RowPinningState } from '@tanstack/alpine-table'

const rowPinningAtom = createAtom<RowPinningState>({
  top: [],
  bottom: [],
})

// subscribe to the atom wherever you need the value
rowPinningAtom.subscribe(() => {
  // react to pinning changes
})

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
  atoms: {
    rowPinning: rowPinningAtom,
  },
})
```

Alternatively, the v8-style `state.rowPinning` plus `onRowPinningChange` pattern is still supported by owning the slice in `Alpine.reactive`. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const local = Alpine.reactive({
  rowPinning: { top: [], bottom: [] } as RowPinningState,
})

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
  state: {
    get rowPinning() {
      return local.rowPinning // connect the reactive slice back down to the table
    },
  },
  onRowPinningChange: (updater) => {
    local.rowPinning =
      typeof updater === 'function' ? updater(local.rowPinning) : updater
  },
})
```

Use `table.setRowPinning` to update the state directly, and `table.resetRowPinning` to reset it to `initialState.rowPinning`. Pass `true` to `resetRowPinning` to clear both pinned row arrays.

```ts
table.setRowPinning({
  top: ['0', '2'],
  bottom: ['8'],
})

table.resetRowPinning()
table.resetRowPinning(true)
```

You can read the current pinning state with `table.atoms.rowPinning.get()`, which is a reactive read when used inside an Alpine binding and a plain read elsewhere.

### Pin Rows With Row APIs

Each row exposes APIs for checking whether it can be pinned, reading its pinned position, and changing its pinned position.

```ts
row.getCanPin()
row.getIsPinned() // 'top', 'bottom', or false
row.getPinnedIndex()

row.pin('top')
row.pin('bottom')
row.pin(false)
```

You can use these APIs to build pinning controls. Because Alpine does not initialize directives inside content set with `x-html`, render any pin buttons on real elements rather than inside a cell renderer. Define a `pin` column that exposes a plain value, then special-case it in your template by column id:

```ts
const columns = [
  {
    id: 'pin',
    header: () => 'Pin',
    cell: () => '', // buttons are rendered on real elements in the template
  },
  //...
]
```

```html
<td>
  <template x-if="cell.column.id === 'pin' && cell.row.getCanPin()">
    <span class="pin-actions">
      <button
        @click="cell.row.pin('top')"
        :disabled="cell.row.getIsPinned() === 'top'"
      >
        Top
      </button>
      <button @click="cell.row.pin(false)" :disabled="!cell.row.getIsPinned()">
        Center
      </button>
      <button
        @click="cell.row.pin('bottom')"
        :disabled="cell.row.getIsPinned() === 'bottom'"
      >
        Bottom
      </button>
    </span>
  </template>
  <template x-if="cell.column.id !== 'pin'">
    <span x-html="FlexRender({ cell })"></span>
  </template>
</td>
```

The `row.pin` API also accepts `includeLeafRows` and `includeParentRows` flags. These can be useful when pinning grouped or expanded rows and deciding whether related parent or leaf rows should move with the row.

### Row Pinning Table APIs

Row pinning splits the current row model into 3 row lists:

```ts
table.getTopRows()
table.getCenterRows()
table.getBottomRows()
```

If you render pinned rows in separate table sections, use those APIs directly with `x-for`:

```html
<tbody>
  <template x-for="row in table.getTopRows()" :key="row.id">
    <tr>
      <template x-for="cell in row.getAllCells()" :key="cell.id">
        <td x-html="FlexRender({ cell })"></td>
      </template>
    </tr>
  </template>
  <template x-for="row in table.getCenterRows()" :key="row.id">
    <tr>
      <template x-for="cell in row.getAllCells()" :key="cell.id">
        <td x-html="FlexRender({ cell })"></td>
      </template>
    </tr>
  </template>
  <template x-for="row in table.getBottomRows()" :key="row.id">
    <tr>
      <template x-for="cell in row.getAllCells()" :key="cell.id">
        <td x-html="FlexRender({ cell })"></td>
      </template>
    </tr>
  </template>
</tbody>
```

Use `table.getIsSomeRowsPinned()` to check whether any rows are pinned, or pass a position to check a specific pinned region.

```ts
table.getIsSomeRowsPinned()
table.getIsSomeRowsPinned('top')
table.getIsSomeRowsPinned('bottom')
```

### Disable Row Pinning

By default, all rows can be pinned. You can disable row pinning for the whole table or decide per row with `enableRowPinning`.

```ts
const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
  enableRowPinning: (row) => row.original.status !== 'archived',
})
```

### Keep Pinned Rows

By default, `keepPinnedRows` is `true`, so pinned rows stay visible in their pinned region even when they would otherwise be filtered or paginated out of the center rows.

Set `keepPinnedRows` to `false` if pinned rows should only render when they are present in the current filtered and paginated row model.

```ts
const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
  keepPinnedRows: false,
})
```
