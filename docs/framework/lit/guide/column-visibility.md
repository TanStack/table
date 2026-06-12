---
title: Column Visibility (Lit) Guide
---

## Examples

Want to skip to the implementation? Check out these Lit examples:

- [Column Visibility](../examples/column-visibility)

### Lit Setup

```ts
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { TableController, tableFeatures, columnVisibilityFeature } from '@tanstack/lit-table'

const features = tableFeatures({ columnVisibilityFeature })

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

## Column Visibility (Lit) Guide

The column visibility feature allows table columns to be hidden or shown dynamically. In v9, add `columnVisibilityFeature` to your `features` to enable this. There is a dedicated `columnVisibility` state and APIs for managing column visibility dynamically.

### Column Visibility State

The `columnVisibility` state is a map of column IDs to boolean values. A column will be hidden if its ID is present in the map and the value is `false`. If the column ID is not present in the map, or the value is `true`, the column will be shown.

If you need to own the `columnVisibility` state yourself (for example, to persist user preferences), the recommended v9 approach is an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the visibility state without going through the component that owns the table.

```ts
import { createAtom } from '@tanstack/store'
import { TableController, tableFeatures, columnVisibilityFeature } from '@tanstack/lit-table'
import type { ColumnVisibilityState } from '@tanstack/lit-table'

const features = tableFeatures({ columnVisibilityFeature })

// create a stable atom at module scope (or in a shared store module)
const columnVisibilityAtom = createAtom<ColumnVisibilityState>({
  columnId1: true,
  columnId2: false, // hide this column by default
  columnId3: true,
})

const table = this.tableController.table({
  features,
  //...
  atoms: {
    columnVisibility: columnVisibilityAtom,
  },
})

// read columnVisibilityAtom.get() (or subscribe to columnVisibilityAtom) wherever you need the value
```

Alternatively, the v8-style `state.columnVisibility` plus `onColumnVisibilityChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const features = tableFeatures({ columnVisibilityFeature })

@state()
private columnVisibility: ColumnVisibilityState = {
  columnId1: true,
  columnId2: false, // hide this column by default
  columnId3: true,
}

const table = this.tableController.table({
  features,
  //...
  state: {
    columnVisibility: this.columnVisibility,
    //...
  },
  onColumnVisibilityChange: (updater) => {
    this.columnVisibility = typeof updater === 'function' ? updater(this.columnVisibility) : updater
  },
})
```

Alternatively, if you don't need to manage the column visibility state outside of the table, you can still set the initial default column visibility state using the `initialState` option.

> **Note**: If `columnVisibility` is provided to both `initialState` and `state`, the `state` initialization will take precedence and `initialState` will be ignored. Do not provide `columnVisibility` to both `initialState` and `state`, only one or the other.

```ts
const features = tableFeatures({ columnVisibilityFeature })

const table = this.tableController.table({
  features,
  //...
  initialState: {
    columnVisibility: {
      columnId1: true,
      columnId2: false, // hide this column by default
      columnId3: true,
    },
    //...
  },
})
```

### Disable Hiding Columns

By default, all columns can be hidden or shown. If you want to prevent certain columns from being hidden, you set the `enableHiding` column option to `false` for those columns.

```ts
const columns = [
  {
    header: 'ID',
    accessorKey: 'id',
    enableHiding: false, // disable hiding for this column
  },
  {
    header: 'Name',
    accessorKey: 'name', // can be hidden
  },
];
```

### Column Visibility Toggle APIs

There are several column API methods that are useful for rendering column visibility toggles in the UI.

- `column.getCanHide` - Useful for disabling the visibility toggle for a column that has `enableHiding` set to `false`.
- `column.getIsVisible` - Useful for setting the initial state of the visibility toggle.
- `column.toggleVisibility` - Useful for toggling the visibility of a column.
- `column.getToggleVisibilityHandler` - Shortcut for hooking up the `column.toggleVisibility` method to a UI event handler.

```ts
html`
  ${table.getAllColumns().map(
    (column) => html`
      <label>
        <input
          type="checkbox"
          .checked=${column.getIsVisible()}
          ?disabled=${!column.getCanHide()}
          @change=${column.getToggleVisibilityHandler()}
        />
        ${column.id}
      </label>
    `,
  )}
`
```

### Column Visibility Aware Table APIs

When you render your header, body, and footer cells, there are a lot of API options available. You may see APIs like `table.getAllLeafColumns` and `row.getAllCells`, but if you use these APIs, they will not take column visibility into account. Instead, you need to use the "visible" variants of these APIs, such as `table.getVisibleLeafColumns` and `row.getVisibleCells`.

```ts
html`
  <table>
    <thead>
      <tr>
        ${table.getVisibleLeafColumns().map((column) => html`<th>${column.id}</th>`)}
      </tr>
    </thead>
    <tbody>
      ${table.getRowModel().rows.map(
        (row) => html`
          <tr>
            ${row.getVisibleCells().map((cell) => html`<td>${FlexRender({ cell })}</td>`)}
          </tr>
        `,
      )}
    </tbody>
  </table>
`
```

If you are using the Header Group APIs, they will already take column visibility into account.
