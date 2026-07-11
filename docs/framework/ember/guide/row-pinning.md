---
title: Row Pinning (Ember) Guide
---

## Examples

Want to skip to the implementation? Check out these Ember examples:

- [Row Pinning](../examples/row-pinning)

### Row Pinning Setup

Here's how you set up your table to use row pinning features. Adding the row pinning feature enables the related APIs.

```ts
import {
  useTable,
  tableFeatures,
  rowPinningFeature,
} from '@tanstack/ember-table'

const features = tableFeatures({ rowPinningFeature })

const table = useTable(() => ({
  features,
  columns,
  data,
}))
```

## Row Pinning (Ember) Guide

Row pinning lets you keep selected rows in top or bottom row regions while the rest of the rows render in the center region.

There are 2 table features that can reorder rows, which happen in the following order:

1. **Row Pinning** - If pinning, rows are split into top, center (unpinned), and bottom pinned rows.
2. [Sorting](./sorting)

### Enable Row Pinning

To use row pinning, add `rowPinningFeature` to your features. Row pinning does not require a row model factory, so no additional slots are needed on `tableFeatures` unless your table uses other row-model features.

```ts
import {
  rowPinningFeature,
  tableFeatures,
  useTable,
} from '@tanstack/ember-table'

const features = tableFeatures({ rowPinningFeature })

const table = useTable(() => ({
  features,
  columns,
  data,
}))
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
const table = useTable(() => ({
  features,
  columns,
  data,
  initialState: {
    rowPinning: {
      top: ['0'],
      bottom: ['3'],
    },
  },
}))
```

If you need to manage row pinning outside of the table instance, the recommended v9 approach is an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the pinning state without re-rendering the component that owns the table.

```ts
import {
  useTable,
  tableFeatures,
  rowPinningFeature,
  createAtom,
  type RowPinningState,
} from '@tanstack/ember-table'

const features = tableFeatures({ rowPinningFeature })

const rowPinningAtom = createAtom<RowPinningState>({
  top: [],
  bottom: [],
})

const table = useTable(() => ({
  features,
  columns,
  data,
  atoms: {
    rowPinning: rowPinningAtom,
  },
}))

// read rowPinningAtom.get() wherever you need the value
```

Alternatively, the v8-style `state.rowPinning` plus `onRowPinningChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
@tracked rowPinning: RowPinningState = { top: [], bottom: [] }

table = useTable(() => ({
  features,
  columns,
  data,
  state: {
    rowPinning: this.rowPinning,
  },
  onRowPinningChange: (updater) => {
    this.rowPinning =
      typeof updater === 'function' ? updater(this.rowPinning) : updater
  },
}))
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

You can use these APIs to build pinning controls. Because Ember templates extract method references without binding them, wrap the row methods in small helper functions and call them from the template.

```gts
const getIsPinned = (
  row: Row<typeof features, Person>,
): false | 'top' | 'bottom' => row.getIsPinned()

const pinTop = (row: Row<typeof features, Person>) => () => row.pin('top')
const pinBottom = (row: Row<typeof features, Person>) => () => row.pin('bottom')
const unpin = (row: Row<typeof features, Person>) => () => row.pin(false)
```

```hbs
<td>
  {{#if (getIsPinned row)}}
    <button {{on 'click' (unpin row)}}>Unpin</button>
  {{else}}
    <button {{on 'click' (pinTop row)}}>Pin Top</button>
    <button {{on 'click' (pinBottom row)}}>Pin Bottom</button>
  {{/if}}
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

If you render pinned rows in separate table sections, use those APIs directly. Expose them as getters and render each region in its own `<tbody>`:

```gts
get topRows() {
  return this.table.getTopRows()
}

get centerRows() {
  return this.table.getCenterRows()
}

get bottomRows() {
  return this.table.getBottomRows()
}
```

```hbs
{{#if this.topRows.length}}
  <tbody class='pinned-rows-top'>
    {{#each this.topRows as |row|}}
      {{! pinned row markup }}
    {{/each}}
  </tbody>
{{/if}}

<tbody>
  {{#each this.centerRows as |row|}}
    {{! center row markup }}
  {{/each}}
</tbody>

{{#if this.bottomRows.length}}
  <tbody class='pinned-rows-bottom'>
    {{#each this.bottomRows as |row|}}
      {{! pinned row markup }}
    {{/each}}
  </tbody>
{{/if}}
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
const table = useTable(() => ({
  features,
  columns,
  data,
  enableRowPinning: (row) => row.original.status !== 'archived',
}))
```

### Keep Pinned Rows

By default, `keepPinnedRows` is `true`, so pinned rows stay visible in their pinned region even when they would otherwise be filtered or paginated out of the center rows.

Set `keepPinnedRows` to `false` if pinned rows should only render when they are present in the current filtered and paginated row model.

```ts
const table = useTable(() => ({
  features,
  columns,
  data,
  keepPinnedRows: false,
}))
```
