---
title: Row Selection (Svelte) Guide
---

## Examples

Want to skip to the implementation? Check out these Svelte examples:

- [Row Selection](../examples/row-selection)

Use getters for reactive inputs such as `data` when passing Svelte state to `createTable`.

### Svelte Setup

```ts
import { createTable, tableFeatures, rowSelectionFeature } from '@tanstack/svelte-table'

const features = tableFeatures({ rowSelectionFeature })

const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
})
```

## Row Selection (Svelte) Guide

The row selection feature keeps track of which rows are selected and allows you to toggle the selection of rows in a myriad of ways. Let's take a look at some common use cases.

### Access Row Selection State

The table instance already manages the row selection state for you. You can access the row selection state or the selected rows from a few APIs.

- `table.state.rowSelection` - returns the row selection state reactively (selected by the `createTable` selector)
- `getSelectedRowModel()` - returns selected rows
- `getFilteredSelectedRowModel()` - returns selected rows after filtering
- `getGroupedSelectedRowModel()` - returns selected rows after grouping and sorting

```ts
console.log(table.state.rowSelection) //get the row selection state - { 1: true, 2: false, etc... }
console.log(table.getSelectedRowModel().rows) //get full client-side selected rows
console.log(table.getFilteredSelectedRowModel().rows) //get filtered client-side selected rows
console.log(table.getGroupedSelectedRowModel().rows) //get grouped client-side selected rows
```

In event handlers or other non-reactive code, you can also read the current snapshot with `table.atoms.rowSelection.get()`. This read only participates in Svelte dependency tracking when called in a rune-tracked context, so prefer `table.state.rowSelection` (or `subscribeTable`) in your markup.

> Note: If you are using `manualPagination`, be aware that the `getSelectedRowModel` API will only return selected rows on the current page because table row models can only generate rows based on the `data` that is passed in. Row selection state, however, can contain row ids that are not present in the `data` array just fine.

### Manage Row Selection State

If you need easy access to the selected row ids in other parts of your application (for example, to make API calls with them), you can own the row selection state slice yourself. The recommended way in v9 is an external atom passed through the `atoms` table option. Atoms preserve fine-grained subscriptions, and the selection value can be read anywhere in your app without coupling that code to the table instance.

```ts
import { createAtom, useSelector } from '@tanstack/svelte-store'
import { createTable, tableFeatures, rowSelectionFeature } from '@tanstack/svelte-table'
import type { RowSelectionState } from '@tanstack/svelte-table'

const features = tableFeatures({ rowSelectionFeature })

const rowSelectionAtom = createAtom<RowSelectionState>({})

// subscribe to the atom wherever you need the value
const rowSelection = useSelector(rowSelectionAtom) // read it reactively with rowSelection.current

const table = createTable({
  features,
  //...
  atoms: {
    rowSelection: rowSelectionAtom, // selection APIs now update rowSelectionAtom
  },
})
```

Alternatively, the v8-style `state.rowSelection` plus `onRowSelectionChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
import { createTableState } from '@tanstack/svelte-table'

const [rowSelection, setRowSelection] = createTableState<RowSelectionState>({})

const table = createTable({
  features,
  //...
  onRowSelectionChange: setRowSelection,
  state: {
    get rowSelection() {
      return rowSelection()
    },
  },
})
```

### Useful Row Ids

By default, the row id for each row is simply the `row.index`. If you are using row selection features, you most likely want to use a more useful row identifier, since the row selection state is keyed by row id. You can use the `getRowId` table option to specify a function that returns a unique row id for each row.

```ts
const table = createTable({
  features,
  //...
  getRowId: (row) => row.uuid, // use the row's uuid from your database as the row id
})
```

Now as rows are selected, the row selection state will look something like this:

```json
{
  "13e79140-62a8-4f9c-b087-5da737903b76": true,
  "f3e2a5c0-5b7a-4d8a-9a5c-9c9b8a8e5f7e": false
  //...
}
```

instead of this:

```json
{
  "0": true,
  "1": false
  //...
}
```

### Enable Row Selection Conditionally

Row selection is enabled by default for all rows. To either enable row selection conditionally for certain rows or disable row selection for all rows, you can use the `enableRowSelection` table option which accepts either a boolean or a function for more granular control.

```ts
const table = createTable({
  //...
  enableRowSelection: row => row.original.age > 18, //only enable row selection for adults
})
```

To enforce whether a row is selectable or not in your UI, you can use the `row.getCanSelect()` API for your checkboxes or other selection UI.

### Single Row Selection

By default, the table allows multiple rows to be selected at once. If, however, you only want to allow a single row to be selected at once, you can set the `enableMultiRowSelection` table option to `false` to disable multi-row selection, or pass in a function to disable multi-row selection conditionally for a row's sub-rows.

This is useful for making tables that have radio buttons instead of checkboxes.

```ts
const table = createTable({
  //...
  enableMultiRowSelection: false, //only allow a single row to be selected at once
  // enableMultiRowSelection: row => row.original.age > 18, //only allow a single row to be selected at once for adults
})
```

### Sub-Row Selection

By default, selecting a parent row will select all of its sub-rows. If you want to disable auto sub-row selection, you can set the `enableSubRowSelection` table option to `false` to disable sub-row selection, or pass in a function to disable sub-row selection conditionally for a row's sub-rows.

```ts
const table = createTable({
  //...
  enableSubRowSelection: false, //disable sub-row selection
  // enableSubRowSelection: row => row.original.age > 18, //disable sub-row selection for adults
})
```

### Render Row Selection UI

TanStack table does not dictate how you should render your row selection UI. You can use checkboxes, radio buttons, or simply hook up click events to the row itself. The table instance provides a few APIs to help you render your row selection UI.

#### Connect Row Selection APIs to Checkbox Inputs

TanStack Table provides some handler functions that you can connect directly to your checkbox inputs to make it easy to toggle row selection. These function automatically call other internal APIs to update the row selection state and re-render the table.

Use the `row.getToggleSelectedHandler()` API to connect to your checkbox inputs to toggle the selection of a row.

Use the `table.getToggleAllRowsSelectedHandler()` or `table.getToggleAllPageRowsSelectedHandler` APIs to connect to your "select all" checkbox input to toggle the selection of all rows.

If you need more granular control over these function handlers, you can always just use the `row.toggleSelected()` or `table.toggleAllRowsSelected()` APIs directly. Or you can even just call the `table.setRowSelection()` API to directly set the row selection state just as you would with any other state updater. These handler functions are just a convenience.

The `indeterminate` checkbox property cannot be set from markup, so define a small Svelte action for it (this is a user-defined helper, not a library export, and is exactly what the [Row Selection example](../examples/row-selection) does):

```svelte
<script lang="ts">
  // Svelte action to set the indeterminate property on checkbox inputs
  function setIndeterminate(node: HTMLInputElement, value: boolean) {
    node.indeterminate = value
    return {
      update(newValue: boolean) {
        node.indeterminate = newValue
      },
    }
  }
</script>

<input
  type="checkbox"
  checked={table.getIsAllRowsSelected()}
  use:setIndeterminate={!table.getIsAllRowsSelected() && table.getIsSomeRowsSelected()}
  onchange={table.getToggleAllRowsSelectedHandler()}
/>

<input
  type="checkbox"
  checked={row.getIsSelected()}
  disabled={!row.getCanSelect()}
  use:setIndeterminate={!row.getIsSelected() && row.getIsSomeSelected()}
  onchange={row.getToggleSelectedHandler()}
/>
```

#### Connect Row Selection APIs to UI

If you want a simpler row selection UI, you can just hook up click events to the row itself. The `row.getToggleSelectedHandler()` API is also useful for this use case.

```svelte
<tbody>
  {#each table.getRowModel().rows as row (row.id)}
    <tr
      class:selected={row.getIsSelected()}
      onclick={row.getToggleSelectedHandler()}
    >
      {#each row.getVisibleCells() as cell (cell.id)}
        <td><FlexRender cell={cell} /></td>
      {/each}
    </tr>
  {/each}
</tbody>
```
