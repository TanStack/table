---
title: Row Selection (Angular) Guide
---

## Examples

Want to skip to the implementation? Check out these Angular examples:

- [Row Selection](../examples/row-selection)
- [Row Selection (Signals)](../examples/row-selection-signal)

### Angular Setup

```ts
import { signal } from '@angular/core'
import { injectTable, tableFeatures, rowSelectionFeature } from '@tanstack/angular-table'

const features = tableFeatures({ rowSelectionFeature })

export class App {
  readonly data = signal(defaultData)

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
  }))
}
```

## Row Selection (Angular) Guide

The row selection feature keeps track of which rows are selected and allows you to toggle the selection of rows in a myriad of ways. Let's take a look at some common use cases.

### Access Row Selection State

The table instance already manages the row selection state for you. You can access the row selection state or the selected rows from a few APIs.

- `table.atoms.rowSelection.get()` - returns the current row selection state
- `getSelectedRowModel()` - returns selected rows
- `getFilteredSelectedRowModel()` - returns selected rows after filtering
- `getGroupedSelectedRowModel()` - returns selected rows after grouping and sorting

```ts
console.log(table.atoms.rowSelection.get()) //get the row selection state - { 1: true, 2: false, etc... }
console.log(table.getSelectedRowModel().rows) //get full client-side selected rows
console.log(table.getFilteredSelectedRowModel().rows) //get filtered client-side selected rows
console.log(table.getGroupedSelectedRowModel().rows) //get grouped client-side selected rows
```

In Angular, table atom reads are signal reads, so reading `table.atoms.rowSelection.get()` in a template expression, `computed(...)`, or `effect(...)` automatically tracks updates.

> Note: If you are using `manualPagination`, be aware that the `getSelectedRowModel` API will only return selected rows on the current page because table row models can only generate rows based on the `data` that is passed in. Row selection state, however, can contain row ids that are not present in the `data` array just fine.

### Manage Row Selection State

If you need easy access to the selected row ids in other parts of your application (for example, to make API calls with them), you can own the row selection state slice yourself. The recommended way in v9 is an external atom (created with `createAtom` from `@tanstack/angular-store`) passed through the `atoms` table option. Atoms preserve fine-grained subscriptions, and the selection value can be read anywhere in your app without re-running the `injectTable` options initializer on every change.

```ts
import { createAtom } from '@tanstack/angular-store'
import { injectTable, tableFeatures, rowSelectionFeature } from '@tanstack/angular-table'
import type { RowSelectionState } from '@tanstack/angular-table'

const features = tableFeatures({ rowSelectionFeature })

export class App {
  readonly rowSelectionAtom = createAtom<RowSelectionState>({})

  readonly table = injectTable(() => ({
    features,
    //...
    atoms: {
      rowSelection: this.rowSelectionAtom, // selection APIs now update rowSelectionAtom
    },
  }))

  // read this.rowSelectionAtom.get() wherever you need the value
}
```

Alternatively, the v8-style `state.rowSelection` plus `onRowSelectionChange` pattern is still supported. In Angular this means owning the slice with an Angular signal, as shown in the [Row Selection (Signals) example](../examples/row-selection-signal). It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
readonly rowSelection = signal<RowSelectionState>({})

readonly table = injectTable(() => ({
  features,
  //...
  onRowSelectionChange: (updater) =>
    typeof updater === 'function'
      ? this.rowSelection.update(updater)
      : this.rowSelection.set(updater),
  state: {
    rowSelection: this.rowSelection(),
  },
}))
```

### Useful Row Ids

By default, the row id for each row is simply the `row.index`. If you are using row selection features, you most likely want to use a more useful row identifier, since the row selection state is keyed by row id. You can use the `getRowId` table option to specify a function that returns a unique row id for each row.

```ts
readonly table = injectTable(() => ({
  features,
  //...
  getRowId: (row) => row.uuid, // use the row's uuid from your database as the row id
}))
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
readonly table = injectTable(() => ({
  //...
  enableRowSelection: row => row.original.age > 18, //only enable row selection for adults
}))
```

To enforce whether a row is selectable or not in your UI, you can use the `row.getCanSelect()` API for your checkboxes or other selection UI.

### Single Row Selection

By default, the table allows multiple rows to be selected at once. If, however, you only want to allow a single row to be selected at once, you can set the `enableMultiRowSelection` table option to `false` to disable multi-row selection, or pass in a function to disable multi-row selection conditionally for a row's sub-rows.

This is useful for making tables that have radio buttons instead of checkboxes.

```ts
readonly table = injectTable(() => ({
  //...
  enableMultiRowSelection: false, //only allow a single row to be selected at once
  // enableMultiRowSelection: row => row.original.age > 18, //only allow a single row to be selected at once for adults
}))
```

### Sub-Row Selection

By default, selecting a parent row will select all of its sub-rows. If you want to disable auto sub-row selection, you can set the `enableSubRowSelection` table option to `false` to disable sub-row selection, or pass in a function to disable sub-row selection conditionally for a row's sub-rows.

```ts
readonly table = injectTable(() => ({
  //...
  enableSubRowSelection: false, //disable sub-row selection
  // enableSubRowSelection: row => row.original.age > 18, //disable sub-row selection for adults
}))
```

### Render Row Selection UI

TanStack table does not dictate how you should render your row selection UI. You can use checkboxes, radio buttons, or simply hook up click events to the row itself. The table instance provides a few APIs to help you render your row selection UI.

#### Connect Row Selection APIs to Checkbox Inputs

TanStack Table provides some handler functions that you can connect directly to your checkbox inputs to make it easy to toggle row selection. These function automatically call other internal APIs to update the row selection state and re-render the table.

Use the `row.getToggleSelectedHandler()` API to connect to your checkbox inputs to toggle the selection of a row.

Use the `table.getToggleAllRowsSelectedHandler()` or `table.getToggleAllPageRowsSelectedHandler` APIs to connect to your "select all" checkbox input to toggle the selection of all rows.

If you need more granular control over these function handlers, you can always just use the `row.toggleSelected()` or `table.toggleAllRowsSelected()` APIs directly. Or you can even just call the `table.setRowSelection()` API to directly set the row selection state just as you would with any other state updater. These handler functions are just a convenience.

```html
<input
  type="checkbox"
  [checked]="table.getIsAllRowsSelected()"
  [indeterminate]="table.getIsSomeRowsSelected()"
  (change)="table.getToggleAllRowsSelectedHandler()?.($event)"
/>

<input
  type="checkbox"
  [checked]="row.getIsSelected()"
  [disabled]="!row.getCanSelect()"
  [indeterminate]="row.getIsSomeSelected()"
  (change)="row.getToggleSelectedHandler()?.($event)"
/>
```

#### Connect Row Selection APIs to UI

If you want a simpler row selection UI, you can just hook up click events to the row itself. The `row.getToggleSelectedHandler()` API is also useful for this use case.

```html
<tbody>
  @for (row of table.getRowModel().rows; track row.id) {
    <tr
      [class.selected]="row.getIsSelected()"
      (click)="row.getToggleSelectedHandler()?.($event)"
    >
      @for (cell of row.getVisibleCells(); track cell.id) {
        <td>
          <ng-container *flexRenderCell="cell; let renderCell">{{ renderCell }}</ng-container>
        </td>
      }
    </tr>
  }
</tbody>
```
