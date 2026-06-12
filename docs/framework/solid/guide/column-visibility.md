---
title: Column Visibility (Solid) Guide
---

## Examples

Want to skip to the implementation? Check out these Solid examples:

- [Column Visibility](../examples/column-visibility)

Use getters for reactive inputs such as `data` when passing Solid signals to `createTable`.

### Solid Setup

```tsx
import { createTable, tableFeatures, columnVisibilityFeature } from '@tanstack/solid-table'

const features = tableFeatures({ columnVisibilityFeature })

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
```

## Column Visibility (Solid) Guide

The column visibility feature allows table columns to be hidden or shown dynamically. In v9, add `columnVisibilityFeature` to your `features` to enable this. There is a dedicated `columnVisibility` state and APIs for managing column visibility dynamically.

### Column Visibility State

The `columnVisibility` state is a map of column IDs to boolean values. A column will be hidden if its ID is present in the map and the value is `false`. If the column ID is not present in the map, or the value is `true`, the column will be shown.

If you need to own the `columnVisibility` state yourself (for example, to persist user preferences), the recommended v9 approach is an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the visibility state without going through the component that owns the table.

```tsx
import { createAtom, useSelector } from '@tanstack/solid-store'
import { createTable, tableFeatures, columnVisibilityFeature } from '@tanstack/solid-table'
import type { ColumnVisibilityState } from '@tanstack/solid-table'

const features = tableFeatures({ columnVisibilityFeature })

const columnVisibilityAtom = createAtom<ColumnVisibilityState>({
  columnId1: true,
  columnId2: false, // hide this column by default
  columnId3: true,
})

const columnVisibility = useSelector(columnVisibilityAtom) // subscribe wherever it is needed

const table = createTable({
  features,
  //...
  atoms: {
    columnVisibility: columnVisibilityAtom,
  },
})
```

Alternatively, the v8-style `state.columnVisibility` plus `onColumnVisibilityChange` pattern is still supported with Solid signals. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```tsx
const features = tableFeatures({ columnVisibilityFeature })

const [columnVisibility, setColumnVisibility] = createSignal<ColumnVisibilityState>({
  columnId1: true,
  columnId2: false, // hide this column by default
  columnId3: true,
})

const table = createTable({
  features,
  //...
  state: {
    get columnVisibility() {
      return columnVisibility() // connect the signal back down to the table
    },
    //...
  },
  onColumnVisibilityChange: setColumnVisibility,
})
```

Alternatively, if you don't need to manage the column visibility state outside of the table, you can still set the initial default column visibility state using the `initialState` option.

> **Note**: If `columnVisibility` is provided to both `initialState` and a controlled option (`atoms` or `state`), the controlled value will take precedence and `initialState` will be ignored. Only provide `columnVisibility` in one place.

```tsx
const features = tableFeatures({ columnVisibilityFeature })

const table = createTable({
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

```tsx
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

```tsx
<For each={table.getAllColumns()}>
  {column => (
    <label>
      <input
        checked={column.getIsVisible()}
        disabled={!column.getCanHide()}
        onChange={column.getToggleVisibilityHandler()}
        type="checkbox"
      />
      {column.columnDef.header}
    </label>
  )}
</For>
```

### Column Visibility Aware Table APIs

When you render your header, body, and footer cells, there are a lot of API options available. You may see APIs like `table.getAllLeafColumns` and `row.getAllCells`, but if you use these APIs, they will not take column visibility into account. Instead, you need to use the "visible" variants of these APIs, such as `table.getVisibleLeafColumns` and `row.getVisibleCells`.

```tsx
<table>
  <thead>
    <tr>
      <For each={table.getVisibleLeafColumns()}>
        {column => {
          // takes column visibility into account
        }}
      </For>
    </tr>
  </thead>
  <tbody>
    <For each={table.getRowModel().rows}>
      {row => (
      <tr>
        <For each={row.getVisibleCells()}>
          {cell => {
            // takes column visibility into account
          }}
        </For>
      </tr>
      )}
    </For>
  </tbody>
</table>
```

If you are using the Header Group APIs, they will already take column visibility into account.
