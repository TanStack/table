---
title: Column Visibility (Preact) Guide
---

## Examples

Want to skip to the implementation? Check out these Preact examples:

- [Column Visibility](../examples/column-visibility)
### Preact Setup

```tsx
import { useTable, tableFeatures, columnVisibilityFeature } from '@tanstack/preact-table'

const features = tableFeatures({ columnVisibilityFeature })

const table = useTable({
  features,
  columns,
  data,
})
```

## Column Visibility (Preact) Guide

The column visibility feature allows table columns to be hidden or shown dynamically. In v9, add `columnVisibilityFeature` to your `features` to enable this. There is a dedicated `columnVisibility` state and APIs for managing column visibility dynamically.

### Column Visibility State

The `columnVisibility` state is a map of column IDs to boolean values. A column will be hidden if its ID is present in the map and the value is `false`. If the column ID is not present in the map, or the value is `true`, the column will be shown.

If you need to own the `columnVisibility` state yourself (for example, to persist user preferences), the recommended v9 approach is an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the visibility state without re-rendering the component that owns the table.

```tsx
import { useCreateAtom, useSelector } from '@tanstack/preact-store'
import { useTable, tableFeatures, columnVisibilityFeature } from '@tanstack/preact-table'
import type { ColumnVisibilityState } from '@tanstack/preact-table'

const features = tableFeatures({ columnVisibilityFeature })

const columnVisibilityAtom = useCreateAtom<ColumnVisibilityState>({
  columnId1: true,
  columnId2: false, // hide this column by default
  columnId3: true,
})

const columnVisibility = useSelector(columnVisibilityAtom) // subscribe wherever it is needed

const table = useTable({
  features,
  //...
  atoms: {
    columnVisibility: columnVisibilityAtom,
  },
})
```

Alternatively, the v8-style `state.columnVisibility` plus `onColumnVisibilityChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```tsx
const features = tableFeatures({ columnVisibilityFeature })

const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({
  columnId1: true,
  columnId2: false, // hide this column by default
  columnId3: true,
})

const table = useTable({
  features,
  //...
  state: {
    columnVisibility,
    //...
  },
  onColumnVisibilityChange: setColumnVisibility,
})
```

Alternatively, if you don't need to manage the column visibility state outside of the table, you can still set the initial default column visibility state using the `initialState` option.

> **Note**: If `columnVisibility` is provided to both `initialState` and `state`, the `state` initialization will take precedence and `initialState` will be ignored. Do not provide `columnVisibility` to both `initialState` and `state`, only one or the other.

```tsx
const features = tableFeatures({ columnVisibilityFeature })

const table = useTable({
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
{table.getAllColumns().map((column) => (
  <label key={column.id}>
    <input
      checked={column.getIsVisible()}
      disabled={!column.getCanHide()}
      onChange={column.getToggleVisibilityHandler()}
      type="checkbox"
    />
    {column.columnDef.header}
  </label>
))}
```

### Column Visibility Aware Table APIs

When you render your header, body, and footer cells, there are a lot of API options available. You may see APIs like `table.getAllLeafColumns` and `row.getAllCells`, but if you use these APIs, they will not take column visibility into account. Instead, you need to use the "visible" variants of these APIs, such as `table.getVisibleLeafColumns` and `row.getVisibleCells`.

```tsx
<table>
  <thead>
    <tr>
      {table.getVisibleLeafColumns().map((column) => ( // takes column visibility into account
        //
      ))}
    </tr>
  </thead>
  <tbody>
    {table.getRowModel().rows.map((row) => (
      <tr key={row.id}>
        {row.getVisibleCells().map((cell) => ( // takes column visibility into account
          //
        ))}
      </tr>
    ))}
  </tbody>
</table>
```

If you are using the Header Group APIs, they will already take column visibility into account.
