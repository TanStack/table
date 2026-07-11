---
title: Composable Tables (createTableHook) Guide
---

`createTableHook` creates an app-specific table factory. Use it to define shared features, row models, and default table options once, then create each Ember table with the columns and data that are unique to that table.

> [!NOTE]
> Unlike the React, Solid, Lit, and Svelte adapters, the Ember `createTableHook` does not register reusable cell/header/table components. Ember already renders cell, header, and footer content with the `FlexRenderCell`, `FlexRenderHeader`, and `FlexRenderFooter` components, so the hook is focused on sharing features and default options. You render an app table with the same components you use for a standalone `useTable` table.

## Examples

- [Basic App Table](../examples/basic-app-table) - Minimal `createTableHook` setup.

## Start With Shared Features and Options

Create one app table hook and put the feature set, row models, and shared defaults there. This example makes sorting available to every table created by `createAppTable`.

```ts
import {
  createSortedRowModel,
  createTableHook,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/ember-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const { createAppTable, createAppColumnHelper } = createTableHook({
  features,
  debugTable: true,
  enableSortingRemoval: false,
})
```

Options passed to `createTableHook` become defaults for every table created by `createAppTable`. The `features` option is also bound to the returned column helper, so column definitions know that sorting APIs are available. The hook also returns `appFeatures` (the feature set you passed in) if you need to reference it elsewhere.

## Create App Columns

Create one column helper per row type. The helper is already bound to your app's feature set, so each table does not need to thread `typeof features` through its column definitions.

```ts
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
}

const columnHelper = createAppColumnHelper<Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: () => 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', {
    header: 'Age',
  }),
  columnHelper.accessor('visits', {
    header: 'Visits',
  }),
])
```

## Create A Table

Create each table with `createAppTable` inside a Glimmer component. Just like `useTable`, options are a thunk so any tracked property they read (such as `this.data`) keeps the table reactive. The call site provides table-specific inputs such as `columns` and `data`; shared features and defaults come from the hook, so you do not pass `features` again.

```gts
import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'

export default class PeopleTable extends Component {
  @tracked data: Array<Person> = []

  table = createAppTable(() => ({
    columns,
    data: this.data,
  }))

  get headerGroups() {
    return this.table.getHeaderGroups()
  }

  get rows() {
    return this.table.getRowModel().rows
  }
}
```

## Render With The Normal Table APIs

You render the table with the same table instance APIs and FlexRender components used by a standalone `useTable` table. As always in Ember templates, wrap `this`-bound method calls (like a sort toggle handler) in small module-level helper functions.

```gts
import { on } from '@ember/modifier'
import { FlexRenderHeader, FlexRenderCell } from '@tanstack/ember-table'
import type { Column, Row, Cell } from '@tanstack/ember-table'

const toggleSort =
  (column: Column<typeof features, Person>) => (event: Event) =>
    column.getToggleSortingHandler()?.(event)

const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells()

// ...inside the component's <template>:
<template>
  <table>
    <thead>
      {{#each this.headerGroups as |headerGroup|}}
        <tr>
          {{#each headerGroup.headers as |header|}}
            <th {{on 'click' (toggleSort header.column)}}>
              <FlexRenderHeader @header={{header}} />
            </th>
          {{/each}}
        </tr>
      {{/each}}
    </thead>
    <tbody>
      {{#each this.rows as |row|}}
        <tr>
          {{#each (getAllCells row) as |cell|}}
            <td><FlexRenderCell @cell={{cell}} /></td>
          {{/each}}
        </tr>
      {{/each}}
    </tbody>
  </table>
</template>
```

## Override Shared Defaults Per Table

Options returned from your `createAppTable` thunk override the defaults from `createTableHook`. Use this for the few tables that need different behavior without creating a separate app hook.

```gts
table = createAppTable(() => ({
  columns,
  data: this.data,
  enableSortingRemoval: true, // override the hook default for this table only
}))
```

## When To Use This Pattern

Use `createTableHook` when multiple tables should share features, row models, default options, or conventions. Use the standalone `useTable` API for a one-off table.
