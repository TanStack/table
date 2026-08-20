---
title: Row Selection (Preact) Guide
---

## Examples

Want to skip to the implementation? Check out these Preact examples:

- [Row Selection](../examples/row-selection)

### Row Selection Setup

Here's how you set up your table to use row selection features. Adding the row selection feature enables the related APIs.

```tsx
import {
  useTable,
  tableFeatures,
  rowSelectionFeature,
} from '@tanstack/preact-table'

const features = tableFeatures({ rowSelectionFeature })

const table = useTable({
  features,
  columns,
  data,
})
```

## Row Selection (Preact) Guide

The row selection feature keeps track of which rows are selected and allows you to toggle the selection of rows in a myriad of ways. Let's take a look at some common use cases.

### Access Row Selection State

The table instance already manages the row selection state for you. You can access the row selection state or the selected rows from a few APIs.

- `table.state.rowSelection` - returns the row selection state reactively (selected by the `useTable` selector)
- `getSelectedRowModel()` - returns selected rows
- `getFilteredSelectedRowModel()` - returns selected rows after filtering
- `getGroupedSelectedRowModel()` - returns selected rows after grouping and sorting

```ts
console.log(table.state.rowSelection) //get the row selection state - { 1: true, 2: false, etc... }
console.log(table.getSelectedRowModel().rows) //get full client-side selected rows
console.log(table.getFilteredSelectedRowModel().rows) //get filtered client-side selected rows
console.log(table.getGroupedSelectedRowModel().rows) //get grouped client-side selected rows
```

In event handlers or other non-render code, you can also read the current snapshot with `table.atoms.rowSelection.get()`. This read does not subscribe a component to future changes, so prefer `table.state.rowSelection` (or `table.Subscribe`) in render positions.

> [!NOTE]
> If you are using `manualPagination`, be aware that the `getSelectedRowModel` API will only return selected rows on the current page because table row models can only generate rows based on the `data` that is passed in. Row selection state, however, can contain row ids that are not present in the `data` array just fine.

### Manage Row Selection State

If you need easy access to the selected row ids in other parts of your application (for example, to make API calls with them), you can own the row selection state slice yourself. The recommended way in v9 is an external atom passed through the `atoms` table option. Atoms preserve fine-grained subscriptions, and the selection value can be read anywhere in your app without forcing the component that owns the table to re-render.

```ts
import { useCreateAtom, useSelector } from '@tanstack/preact-store'
import {
  useTable,
  tableFeatures,
  rowSelectionFeature,
  type RowSelectionState,
} from '@tanstack/preact-table'

const features = tableFeatures({ rowSelectionFeature })

const rowSelectionAtom = useCreateAtom<RowSelectionState>({})

// subscribe to the atom wherever you need the value
const rowSelection = useSelector(rowSelectionAtom)

const table = useTable({
  features,
  //...
  atoms: {
    rowSelection: rowSelectionAtom, // selection APIs now update rowSelectionAtom
  },
})
```

Alternatively, the v8-style `state.rowSelection` plus `onRowSelectionChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

const table = useTable({
  features,
  //...
  onRowSelectionChange: setRowSelection,
  state: {
    rowSelection,
  },
})
```

### Useful Row Ids

By default, the row id for each row is simply the `row.index`. If you are using row selection features, you most likely want to use a more useful row identifier, since the row selection state is keyed by row id. You can use the `getRowId` table option to specify a function that returns a unique row id for each row.

```ts
const table = useTable({
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
const table = useTable({
  //...
  enableRowSelection: (row) => row.original.age > 18, //only enable row selection for adults
})
```

To enforce whether a row is selectable or not in your UI, you can use the `row.getCanSelect()` API for your checkboxes or other selection UI.

### Single Row Selection

By default, the table allows multiple rows to be selected at once. If, however, you only want to allow a single row to be selected at once, you can set the `enableMultiRowSelection` table option to `false` to disable multi-row selection, or pass in a function to disable multi-row selection conditionally for a row's sub-rows.

This is useful for making tables that have radio buttons instead of checkboxes.

```ts
const table = useTable({
  //...
  enableMultiRowSelection: false, //only allow a single row to be selected at once
  // enableMultiRowSelection: row => row.original.age > 18, //only allow a single row to be selected at once for adults
})
```

### Sub-Row Selection

By default, selecting a parent row will select all of its sub-rows. If you want to disable auto sub-row selection, you can set the `enableSubRowSelection` table option to `false` to disable sub-row selection, or pass in a function to disable sub-row selection conditionally for a row's sub-rows.

```ts
const table = useTable({
  //...
  enableSubRowSelection: false, //disable sub-row selection
  // enableSubRowSelection: row => row.original.age > 18, //disable sub-row selection for adults
})
```

Sub-row selection also applies to the select-all APIs. When a parent row blocks sub-row selection, `table.toggleAllRowsSelected()` and `table.toggleAllPageRowsSelected()` skip that parent's descendants, and `table.getIsAllRowsSelected()` and `table.getIsAllPageRowsSelected()` ignore those descendants when deciding whether everything is selected.

Selecting a parent row writes the parent id and its selectable descendant ids into the row selection state. Deselecting a child afterwards does not remove the parent id by default, since some tables treat the state ids as literal selections. Pass the `deselectParents` option to the toggle APIs to remove ancestor ids whenever a row is deselected:

```ts
row.getToggleSelectedHandler({ deselectParents: true })
// or
row.toggleSelected(false, { deselectParents: true })
```

### Shift Range Selection

`row.getToggleSelectedHandler()` supports Shift range selection by default. After an ordinary selectable-row interaction establishes an anchor, Shift-selecting another row selects or deselects the inclusive interval between them. The clicked checkbox's resulting checked value controls the whole range, and the clicked endpoint becomes the anchor for the next Shift interaction.

The handler recognizes Shift when the event exposes either `event.shiftKey` or `event.nativeEvent.shiftKey`. You can disable range behavior or replace event detection:

Bind a Preact checkbox handler with `onClick`, not `onChange`, so the handler receives the click event and its `shiftKey` modifier.

```ts
const table = useTable({
  // ...
  enableRowRangeSelection: false,

  // For example, use the platform modifier instead of Shift:
  // isRowRangeSelectionEvent: event =>
  //   Boolean((event as { metaKey?: boolean }).metaKey),
})
```

Range selection follows the table's current logical display order, including filtering, grouping, sorting, and expansion. With client-side pagination, ranges can cross pages because the complete pre-pagination order is used. With manual/server pagination, only rows loaded in the current `data` can participate.

By default, a parent encountered in a range recursively toggles its selectable descendants when sub-row selection is enabled. Pass `selectChildren: false` when only rows explicitly present in the display-order interval should change:

```ts
const handler = row.getToggleSelectedHandler({
  selectChildren: false,
})
```

The interaction anchor is preserved across sorting, filtering, grouping, expansion, pagination, and data updates while its row id remains in the display order. If filtering or data replacement removes the anchor, the next Shift interaction falls back to an ordinary row toggle and establishes a new anchor. `resetRowSelection`, either select-all API, and `table.reset()` clear the anchor. Direct calls to `row.toggleSelected()` or `table.setRowSelection()`, and external controlled-state changes, do not establish or move it.

### Render Row Selection UI

TanStack table does not dictate how you should render your row selection UI. You can use checkboxes, radio buttons, or simply hook up click events to the row itself. The table instance provides a few APIs to help you render your row selection UI.

#### Connect Row Selection APIs to Checkbox Inputs

TanStack Table provides some handler functions that you can connect directly to your checkbox inputs to make it easy to toggle row selection. These functions automatically call other internal APIs to update the row selection state and re-render the table.

Use the `row.getToggleSelectedHandler()` API to connect to your checkbox inputs to toggle the selection of a row.

Use the `table.getToggleAllRowsSelectedHandler()` or `table.getToggleAllPageRowsSelectedHandler` APIs to connect to your "select all" checkbox input to toggle the selection of all rows.

If you need more granular control over these function handlers, you can always just use the `row.toggleSelected()` or `table.toggleAllRowsSelected()` APIs directly. Or you can even just call the `table.setRowSelection()` API to directly set the row selection state just as you would with any other state updater. These handler functions are just a convenience.

```tsx
const columns = [
  {
    id: 'select-col',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()} //or getToggleAllPageRowsSelectedHandler
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={
          row.getIsSelected() ||
          (row.getCanSelectSubRows() && row.getIsAllSubRowsSelected())
        }
        disabled={!row.getCanSelect()}
        indeterminate={row.getIsSomeSelected()}
        onClick={row.getToggleSelectedHandler()}
      />
    ),
  },
  //... more column definitions...
]
```

> [!NOTE]
> The `getCanSelectSubRows()` and `getIsAllSubRowsSelected()` clauses on the row checkbox only matter for tables with sub-rows. With flat data, `row.getIsSelected()` alone is enough. See the expanding example for the full pattern, including the `deselectParents` option for pruning stale parent ids when children are deselected.

#### Connect Row Selection APIs to UI

If you want a simpler row selection UI, you can just hook up click events to the row itself. The `row.getToggleSelectedHandler()` API is also useful for this use case.

```tsx
<tbody>
  {table.getRowModel().rows.map((row) => {
    return (
      <tr
        key={row.id}
        className={row.getIsSelected() ? 'selected' : null}
        onClick={row.getToggleSelectedHandler()}
      >
        {row.getVisibleCells().map((cell) => {
          return <td key={cell.id}>{/* */}</td>
        })}
      </tr>
    )
  })}
</tbody>
```
