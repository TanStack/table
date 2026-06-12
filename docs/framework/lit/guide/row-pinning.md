---
title: Row Pinning (Lit) Guide
---

## Examples

Want to skip to the implementation? Check out these Lit examples:

- [Row Pinning](../examples/row-pinning)

### Lit Setup

```ts
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { TableController, tableFeatures, rowPinningFeature } from '@tanstack/lit-table'

const features = tableFeatures({ rowPinningFeature })

@customElement('my-table')
class MyTable extends LitElement {
  @state()
  private data = defaultData

  private tableController = new TableController(this)

  protected render() {
    const table = this.tableController.table({
      features,
      columns,
      data: this.data,
    })

    return html`...`
  }
}
```

## Row Pinning (Lit) Guide

Row pinning lets you keep selected rows in top or bottom row regions while the rest of the rows render in the center region.

There are 2 table features that can reorder rows, which happen in the following order:

1. **Row Pinning** - If pinning, rows are split into top, center (unpinned), and bottom pinned rows.
2. [Sorting](./sorting)

### Enable Row Pinning

To use row pinning, add `rowPinningFeature` to your features. Row pinning does not require a row model factory; no row model slot is needed in `tableFeatures` unless your table uses other row-model features.

```ts
import {
  rowPinningFeature,
  tableFeatures,
  TableController,
} from '@tanstack/lit-table'

const features = tableFeatures({ rowPinningFeature })

const table = this.tableController.table({
  features,
  columns,
  data: this.data,
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
const table = this.tableController.table({
  features,
  columns,
  data: this.data,
  initialState: {
    rowPinning: {
      top: ['0'],
      bottom: ['3'],
    },
  },
})
```

If you need to manage row pinning outside of the table instance, the recommended v9 approach is an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the pinning state without going through the component that owns the table.

```ts
import { createAtom } from '@tanstack/store'
import type { RowPinningState } from '@tanstack/lit-table'

// create a stable atom at module scope (or in a shared store module)
const rowPinningAtom = createAtom<RowPinningState>({
  top: [],
  bottom: [],
})

const table = this.tableController.table({
  features,
  columns,
  data: this.data,
  atoms: {
    rowPinning: rowPinningAtom,
  },
})

// read rowPinningAtom.get() (or subscribe to rowPinningAtom) wherever you need the value
```

Alternatively, the v8-style `state.rowPinning` plus `onRowPinningChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
@state()
private rowPinning: RowPinningState = {
  top: [],
  bottom: [],
}

const table = this.tableController.table({
  features,
  columns,
  data: this.data,
  state: {
    rowPinning: this.rowPinning,
  },
  onRowPinningChange: (updater) => {
    this.rowPinning = typeof updater === 'function' ? updater(this.rowPinning) : updater
  },
})
```

Use `table.setRowPinning` to update the state directly, and `table.resetRowPinning` to reset it to `initialState.rowPinning`. Pass `true` to `resetRowPinning` to clear both pinned row arrays.

```ts
table.setRowPinning({
  top: ['0', '2'],
  bottom: ['8'],
}

table.resetRowPinning()
table.resetRowPinning(true)
```

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

You can use these APIs to build pinning controls:

```ts
row.getCanPin()
  ? html`
      <div>
        <button @click=${() => row.pin('top')} ?disabled=${row.getIsPinned() === 'top'}>Top</button>
        <button @click=${() => row.pin(false)} ?disabled=${!row.getIsPinned()}>Center</button>
        <button @click=${() => row.pin('bottom')} ?disabled=${row.getIsPinned() === 'bottom'}>Bottom</button>
      </div>
    `
  : null
```

The `row.pin` API also accepts `includeLeafRows` and `includeParentRows` flags. These can be useful when pinning grouped or expanded rows and deciding whether related parent or leaf rows should move with the row.

### Row Pinning Table APIs

Row pinning splits the current row model into 3 row lists:

```ts
table.getTopRows()
table.getCenterRows()
table.getBottomRows()
```

If you render pinned rows in separate table sections, use those APIs directly:

```ts
html`
  <tbody>
    ${table.getTopRows().map((row) => html`<pinned-row .row=${row}></pinned-row>`)}
    ${table.getCenterRows().map((row) => html`<table-row .row=${row}></table-row>`)}
    ${table.getBottomRows().map((row) => html`<pinned-row .row=${row}></pinned-row>`)}
  </tbody>
`
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
const table = this.tableController.table({
  features,
  columns,
  data: this.data,
  enableRowPinning: row => row.original.status !== 'archived',
})
```

### Keep Pinned Rows

By default, `keepPinnedRows` is `true`, so pinned rows stay visible in their pinned region even when they would otherwise be filtered or paginated out of the center rows.

Set `keepPinnedRows` to `false` if pinned rows should only render when they are present in the current filtered and paginated row model.

```ts
const table = this.tableController.table({
  features,
  columns,
  data: this.data,
  keepPinnedRows: false,
})
```
