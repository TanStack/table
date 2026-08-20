---
title: Column Visibility (Alpine) Guide
---

## Examples

Want to skip to the implementation? Check out these Alpine examples:

- [Column Visibility](../examples/column-visibility)

Read your reactive inputs such as `data` through a getter (for example backing them with `Alpine.reactive`) when creating the table, so the table sees updates.

### Column Visibility Setup

Here's how you set up your table to use column visibility features. Adding the column visibility feature enables the related APIs.

```ts
import {
  columnVisibilityFeature,
  createTable,
  tableFeatures,
} from '@tanstack/alpine-table'

const features = tableFeatures({ columnVisibilityFeature })

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
})
```

## Column Visibility (Alpine) Guide

The column visibility feature allows table columns to be hidden or shown dynamically. In v9, add `columnVisibilityFeature` to your `features` to enable this. There is a dedicated `columnVisibility` state and APIs for managing column visibility dynamically.

### Column Visibility State

The `columnVisibility` state is a map of column IDs to boolean values. A column will be hidden if its ID is present in the map and the value is `false`. If the column ID is not present in the map, or the value is `true`, the column will be shown.

If you need to own the `columnVisibility` state yourself (for example, to persist user preferences), the recommended v9 approach is an external atom passed to the table's `atoms` option. External atoms give you fine-grained subscriptions anywhere in your app, and other code can read or write the visibility state without going through the component that owns the table. `@tanstack/store` is already a dependency of `@tanstack/alpine-table`, so `createAtom` is available.

```ts
import { createAtom } from '@tanstack/store'
import {
  columnVisibilityFeature,
  createTable,
  tableFeatures,
} from '@tanstack/alpine-table'
import type { ColumnVisibilityState } from '@tanstack/alpine-table'

const features = tableFeatures({ columnVisibilityFeature })

const columnVisibilityAtom = createAtom<ColumnVisibilityState>({
  columnId1: true,
  columnId2: false, // hide this column by default
  columnId3: true,
})

// subscribe to the atom wherever you need the value
columnVisibilityAtom.subscribe(() => {
  // react to visibility changes
})

const table = createTable({
  features,
  //...
  atoms: {
    columnVisibility: columnVisibilityAtom,
  },
})
```

Alternatively, the v8-style `state.columnVisibility` plus `onColumnVisibilityChange` pattern is still supported by owning the slice in `Alpine.reactive`. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const local = Alpine.reactive({
  columnVisibility: {
    columnId1: true,
    columnId2: false, // hide this column by default
    columnId3: true,
  } as ColumnVisibilityState,
})

const table = createTable({
  features,
  //...
  state: {
    get columnVisibility() {
      return local.columnVisibility // connect the reactive slice back down to the table
    },
    //...
  },
  onColumnVisibilityChange: (updater) => {
    local.columnVisibility =
      typeof updater === 'function' ? updater(local.columnVisibility) : updater
  },
})
```

Alternatively, if you don't need to manage the column visibility state outside of the table, you can still set the initial default column visibility state using the `initialState` option.

> [!NOTE]
> If `columnVisibility` is provided to both `initialState` and a controlled option (`atoms` or `state`), the controlled value will take precedence and `initialState` will be ignored. Only provide `columnVisibility` in one place.

```ts
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
]
```

### Column Visibility Toggle APIs

There are several column API methods that are useful for rendering column visibility toggles in the UI.

- `column.getCanHide` - Useful for disabling the visibility toggle for a column that has `enableHiding` set to `false`.
- `column.getIsVisible` - Useful for setting the initial state of the visibility toggle.
- `column.toggleVisibility` - Useful for toggling the visibility of a column.
- `column.getToggleVisibilityHandler` - Shortcut for hooking up the `column.toggleVisibility` method to a UI event handler.

Render a checkbox per column on real elements (not inside `x-html`). Bind `:checked` to `column.getIsVisible()`, `:disabled` to `!column.getCanHide()`, and call the handler returned by `getToggleVisibilityHandler` from `@change`.

```html
<template x-for="column in table.getAllLeafColumns()" :key="column.id">
  <label>
    <input
      type="checkbox"
      :checked="column.getIsVisible()"
      :disabled="!column.getCanHide()"
      @change="column.getToggleVisibilityHandler()($event)"
    />
    <span x-text="column.id"></span>
  </label>
</template>
```

A "Toggle All" checkbox can use the table-level helpers `table.getIsAllColumnsVisible()` and `table.getToggleAllColumnsVisibilityHandler()`.

```html
<label>
  <input
    type="checkbox"
    :checked="table.getIsAllColumnsVisible()"
    @change="table.getToggleAllColumnsVisibilityHandler()($event)"
  />
  Toggle All
</label>
```

### Column Visibility Aware Table APIs

When you render your header, body, and footer cells, there are a lot of API options available. You may see APIs like `table.getAllLeafColumns` and `row.getAllCells`, but if you use these APIs, they will not take column visibility into account. Instead, you need to use the "visible" variants of these APIs, such as `table.getVisibleLeafColumns` and `row.getVisibleCells`.

Render cell and header content with `x-html="FlexRender(...)"`, and use the visible-aware row models when iterating with `x-for`:

```html
<table>
  <thead>
    <template
      x-for="headerGroup in table.getHeaderGroups()"
      :key="headerGroup.id"
    >
      <tr>
        <!-- header groups already take column visibility into account -->
        <template x-for="header in headerGroup.headers" :key="header.id">
          <th :colspan="header.colSpan">
            <template x-if="!header.isPlaceholder">
              <span x-html="FlexRender({ header })"></span>
            </template>
          </th>
        </template>
      </tr>
    </template>
  </thead>
  <tbody>
    <template x-for="row in table.getRowModel().rows" :key="row.id">
      <tr>
        <!-- takes column visibility into account -->
        <template x-for="cell in row.getVisibleCells()" :key="cell.id">
          <td x-html="FlexRender({ cell })"></td>
        </template>
      </tr>
    </template>
  </tbody>
</table>
```

If you are using the Header Group APIs, they will already take column visibility into account.
