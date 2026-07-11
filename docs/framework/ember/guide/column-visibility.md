---
title: Column Visibility (Ember) Guide
---

## Examples

Want to skip to the implementation? Check out these Ember examples:

- [Column Visibility](../examples/column-visibility)

### Column Visibility Setup

Here's how you set up your table to use column visibility features. Adding the column visibility feature enables the related APIs.

```ts
import {
  useTable,
  tableFeatures,
  columnVisibilityFeature,
} from '@tanstack/ember-table'

const features = tableFeatures({ columnVisibilityFeature })

const table = useTable(() => ({
  features,
  columns,
  data,
}))
```

## Column Visibility (Ember) Guide

The column visibility feature allows table columns to be hidden or shown dynamically. In v9, add `columnVisibilityFeature` to your `features` to enable this. There is a dedicated `columnVisibility` state and APIs for managing column visibility dynamically.

### Column Visibility State

The `columnVisibility` state is a map of column IDs to boolean values. A column will be hidden if its ID is present in the map and the value is `false`. If the column ID is not present in the map, or the value is `true`, the column will be shown.

If you need to own the `columnVisibility` state yourself (for example, to persist user preferences), the recommended v9 approach is an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the visibility state without re-rendering the component that owns the table.

```ts
import {
  useTable,
  tableFeatures,
  columnVisibilityFeature,
  createAtom,
  type ColumnVisibilityState,
} from '@tanstack/ember-table'

const features = tableFeatures({ columnVisibilityFeature })

const columnVisibilityAtom = createAtom<ColumnVisibilityState>({
  columnId1: true,
  columnId2: false, // hide this column by default
  columnId3: true,
})

const columnVisibility = columnVisibilityAtom.get() // read the atom wherever it is needed

const table = useTable(() => ({
  features,
  //...
  atoms: {
    columnVisibility: columnVisibilityAtom,
  },
}))
```

Alternatively, the v8-style `state.columnVisibility` plus `onColumnVisibilityChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const features = tableFeatures({ columnVisibilityFeature })

// inside your Glimmer component class
@tracked columnVisibility: ColumnVisibilityState = {
  columnId1: true,
  columnId2: false, // hide this column by default
  columnId3: true,
}

table = useTable(() => ({
  features,
  //...
  state: {
    columnVisibility: this.columnVisibility,
    //...
  },
  onColumnVisibilityChange: (updater) => {
    this.columnVisibility =
      typeof updater === 'function' ? updater(this.columnVisibility) : updater
  },
}))
```

Alternatively, if you don't need to manage the column visibility state outside of the table, you can still set the initial default column visibility state using the `initialState` option.

> **Note**: If `columnVisibility` is provided to both `initialState` and `state`, the `state` initialization will take precedence and `initialState` will be ignored. Do not provide `columnVisibility` to both `initialState` and `state`, only one or the other.

```ts
const features = tableFeatures({ columnVisibilityFeature })

const table = useTable(() => ({
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
}))
```

### Disable Hiding Columns

By default, all columns can be hidden or shown. If you want to prevent certain columns from being hidden, you set the `enableHiding` column option to `false` for those columns.

```ts
const columns = columnHelper.columns([
  columnHelper.accessor('id', {
    header: 'ID',
    enableHiding: false, // disable hiding for this column
  }),
  columnHelper.accessor('name', {
    header: 'Name', // can be hidden
  }),
])
```

### Column Visibility Toggle APIs

There are several column API methods that are useful for rendering column visibility toggles in the UI.

- `column.getCanHide` - Useful for disabling the visibility toggle for a column that has `enableHiding` set to `false`.
- `column.getIsVisible` - Useful for setting the initial state of the visibility toggle.
- `column.toggleVisibility` - Useful for toggling the visibility of a column.
- `column.getToggleVisibilityHandler` - Shortcut for hooking up the `column.toggleVisibility` method to a UI event handler.

```ts
const getIsVisible = (column: Column<typeof features, Person>): boolean =>
  column.getIsVisible()

const getCanHide = (column: Column<typeof features, Person>): boolean =>
  column.getCanHide()

const not = (value: unknown): boolean => !value

const toggleColumnVisibility = (column: Column<typeof features, Person>) => {
  return (event: Event) => {
    column.getToggleVisibilityHandler()(event)
  }
}
```

```hbs
{{#each this.allColumns as |column|}}
  <label>
    <input
      type='checkbox'
      checked={{getIsVisible column}}
      disabled={{not (getCanHide column)}}
      {{on 'change' (toggleColumnVisibility column)}}
    />
    {{column.columnDef.header}}
  </label>
{{/each}}
```

### Column Visibility Aware Table APIs

When you render your header, body, and footer cells, there are a lot of API options available. You may see APIs like `table.getAllLeafColumns` and `row.getAllCells`, but if you use these APIs, they will not take column visibility into account. Instead, you need to use the "visible" variants of these APIs, such as `table.getVisibleLeafColumns` and `row.getVisibleCells`.

```hbs
<table>
  <thead>
    <tr>
      {{#each this.visibleLeafColumns as |column|}}
        {{! takes column visibility into account }}
      {{/each}}
    </tr>
  </thead>
  <tbody>
    {{#each this.rows as |row|}}
      <tr>
        {{#each (getVisibleCells row) as |cell|}}
          {{! takes column visibility into account }}
        {{/each}}
      </tr>
    {{/each}}
  </tbody>
</table>
```

If you are using the Header Group APIs, they will already take column visibility into account.
