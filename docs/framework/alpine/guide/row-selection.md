---
title: Row Selection (Alpine) Guide
---

## Examples

Want to skip to the implementation? Check out these Alpine examples:

- [Row Selection](../examples/row-selection)

Read your reactive inputs such as `data` through a getter (for example backing them with `Alpine.reactive`) when creating the table, so the table sees updates.

### Row Selection Setup

Here's how you set up your table to use row selection features. Adding the row selection feature enables the related APIs.

```ts
import {
  createTable,
  tableFeatures,
  rowSelectionFeature,
} from '@tanstack/alpine-table'

const features = tableFeatures({ rowSelectionFeature })

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
})
```

## Row Selection (Alpine) Guide

The row selection feature keeps track of which rows are selected and allows you to toggle the selection of rows in a myriad of ways. Let's take a look at some common use cases.

### Access Row Selection State

The table instance already manages the row selection state for you. You can access the row selection state or the selected rows from a few APIs.

- `table.atoms.rowSelection.get()` - returns the row selection state (reactive when read inside an Alpine binding)
- `getSelectedRowModel()` - returns selected rows
- `getFilteredSelectedRowModel()` - returns selected rows after filtering
- `getGroupedSelectedRowModel()` - returns selected rows after grouping and sorting

```ts
console.log(table.atoms.rowSelection.get()) //get the row selection state - { 1: true, 2: false, etc... }
console.log(table.getSelectedRowModel().rows) //get full client-side selected rows
console.log(table.getFilteredSelectedRowModel().rows) //get filtered client-side selected rows
console.log(table.getGroupedSelectedRowModel().rows) //get grouped client-side selected rows
```

In Alpine, the table's state atoms are reactive. `table.atoms.rowSelection.get()` is a reactive read when called inside an Alpine binding (`x-text`, `x-html`, `:value`, `x-if`, `x-for`, `x-effect`, or a getter/method on your `Alpine.data` object); in event handlers and other untracked code, the same call simply returns the current value.

> Note: If you are using `manualPagination`, be aware that the `getSelectedRowModel` API will only return selected rows on the current page because table row models can only generate rows based on the `data` that is passed in. Row selection state, however, can contain row ids that are not present in the `data` array just fine.

### Manage Row Selection State

If you need easy access to the selected row ids in other parts of your application (for example, to make API calls with them), you can own the row selection state slice yourself. The recommended way in v9 is an external atom passed through the `atoms` table option. `@tanstack/store` is already a dependency of `@tanstack/alpine-table`, so `createAtom` is available. Atoms preserve fine-grained subscriptions, and the selection value can be read anywhere in your app without making the table depend on component-local state.

```ts
import { createAtom } from '@tanstack/store'
import {
  createTable,
  tableFeatures,
  rowSelectionFeature,
  type RowSelectionState,
} from '@tanstack/alpine-table'

const features = tableFeatures({ rowSelectionFeature })

const rowSelectionAtom = createAtom<RowSelectionState>({})

// subscribe to the atom wherever you need the value
rowSelectionAtom.subscribe(() => {
  // react to selection changes
})

const table = createTable({
  features,
  //...
  atoms: {
    rowSelection: rowSelectionAtom, // selection APIs now update rowSelectionAtom
  },
})
```

Alternatively, the v8-style `state.rowSelection` plus `onRowSelectionChange` pattern is still supported by owning the slice in `Alpine.reactive`. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const local = Alpine.reactive({ rowSelection: {} as RowSelectionState })

const table = createTable({
  features,
  //...
  state: {
    get rowSelection() {
      return local.rowSelection // connect the reactive slice back down to the table
    },
  },
  onRowSelectionChange: (updater) => {
    local.rowSelection =
      typeof updater === 'function' ? updater(local.rowSelection) : updater
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
  enableRowSelection: (row) => row.original.age > 18, //only enable row selection for adults
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

Bind an Alpine checkbox handler with `@click`, not `@change`, so the handler receives the click event and its `shiftKey` modifier.

```ts
const table = createTable({
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

TanStack Table does not dictate how you should render your row selection UI. You can use checkboxes, radio buttons, or simply hook up click events to the row itself. The table instance provides a few APIs to help you render your row selection UI.

#### Connect Row Selection APIs to Checkbox Inputs

TanStack Table provides some handler functions that you can connect directly to your checkbox inputs to make it easy to toggle row selection. These functions automatically call other internal APIs to update the row selection state and re-render the table.

Use the `row.getToggleSelectedHandler()` API to connect to your checkbox inputs to toggle the selection of a row.

Use the `table.getToggleAllRowsSelectedHandler()` or `table.getToggleAllPageRowsSelectedHandler` APIs to connect to your "select all" checkbox input to toggle the selection of all rows.

If you need more granular control over these function handlers, you can always just use the `row.toggleSelected()` or `table.toggleAllRowsSelected()` APIs directly. Or you can even just call the `table.setRowSelection()` API to directly set the row selection state just as you would with any other state updater. These handler functions are just a convenience.

Because checkboxes are interactive and Alpine cannot process directives inside content set with `x-html`, they cannot live in a cell or header renderer. Define a `select` column that exposes a plain value, then render the real `<input>` elements in your template, special-cased by column id. Bind the indeterminate state with `x-effect`, since it is a DOM property that cannot be set with a normal attribute binding.

```ts
const columns = [
  {
    id: 'select',
    header: () => '', // checkboxes are rendered on real elements in the template
    cell: () => '',
  },
  //... more column definitions...
]
```

```html
<!-- select header: select-all checkbox -->
<template x-if="header.column.id === 'select'">
  <input
    type="checkbox"
    style="cursor: pointer"
    :checked="table.getIsAllRowsSelected()"
    x-effect="$el.indeterminate = table.getIsSomeRowsSelected()"
    @change="table.getToggleAllRowsSelectedHandler()($event)"
  />
</template>
<!-- other headers -->
<template x-if="header.column.id !== 'select'">
  <span x-html="FlexRender({ header })"></span>
</template>
```

```html
<!-- select cell: per-row checkbox -->
<template x-if="cell.column.id === 'select'">
  <input
    type="checkbox"
    style="cursor: pointer"
    :checked="cell.row.getIsSelected() ||
      (cell.row.getCanSelectSubRows() && cell.row.getIsAllSubRowsSelected())"
    :disabled="!cell.row.getCanSelect()"
    x-effect="$el.indeterminate = !cell.row.getIsSelected() && cell.row.getIsSomeSelected()"
    @click="cell.row.getToggleSelectedHandler()($event)"
  />
</template>
<!-- other cells -->
<template x-if="cell.column.id !== 'select'">
  <span x-html="FlexRender({ cell })"></span>
</template>
```

> **Note:** The `getCanSelectSubRows()` and `getIsAllSubRowsSelected()` clauses on the row checkbox only matter for tables with sub-rows. With flat data, `row.getIsSelected()` alone is enough. See the expanding example for the full pattern, including the `deselectParents` option for pruning stale parent ids when children are deselected.

#### Connect Row Selection APIs to UI

If you want a simpler row selection UI, you can just hook up click events to the row itself. The `row.getToggleSelectedHandler()` API is also useful for this use case. Attach it to a real element such as the `<tr>`.

```html
<tbody>
  <template x-for="row in table.getRowModel().rows" :key="row.id">
    <tr
      :class="row.getIsSelected() ? 'selected' : ''"
      @click="row.getToggleSelectedHandler()($event)"
    >
      <template x-for="cell in row.getVisibleCells()" :key="cell.id">
        <td x-html="FlexRender({ cell })"></td>
      </template>
    </tr>
  </template>
</tbody>
```
