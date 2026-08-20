---
title: Composable Tables (createTableHook) Guide
---

`createTableHook` creates an app-specific table factory. Use it to define shared features, row models, and default table options once, then create each Alpine table with the columns and data that are unique to that table.

> [!NOTE]
> Unlike the React, Solid, Lit, and Svelte adapters, the Alpine `createTableHook` does not register reusable cell/header/table components. Alpine renders cell and header content as HTML strings through `x-html`, and Alpine has no component primitive to bind, so the hook is focused on sharing features and default options. Reusable interactive markup is expressed with [`Alpine.bind`](https://alpinejs.dev/globals/alpine-bind) bundles in your templates instead.

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
} from '@tanstack/alpine-table'

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

Options passed to `createTableHook` become defaults for every table created by `createAppTable`. The `features` option is also bound to the returned column helper, so column definitions know that sorting APIs are available.

## Create App Columns

Create one column helper per row type. The helper is already bound to your app's feature set, so each table does not need to thread `typeof features` through its column definitions. Renderers return HTML strings, which are rendered with `x-html` via `table.FlexRender`.

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
    header: () => '<span>Last Name</span>',
    cell: (info) => `<i>${info.getValue()}</i>`,
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

Create each table with `createAppTable` inside an `Alpine.data` component. The call site provides table-specific inputs such as `columns` and reactive `data`; shared features and defaults come from the hook.

```ts
import Alpine from 'alpinejs'

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: [] as Array<Person> })

  const table = createAppTable({
    columns,
    get data() {
      return local.data
    },
  })

  return { table }
})

window.Alpine = Alpine
Alpine.start()
```

## Render With The Normal Table APIs

You render the table with the same table instance APIs used by a standalone `createTable` table. `table.FlexRender` is attached to the instance, so you do not need to import the top-level helper. Attach the sort click handler to a real element (Alpine does not initialize directives inside `x-html`).

```html
<div x-data="table">
  <table>
    <thead>
      <template
        x-for="headerGroup in table.getHeaderGroups()"
        :key="headerGroup.id"
      >
        <tr>
          <template x-for="header in headerGroup.headers" :key="header.id">
            <th @click="header.column.getToggleSortingHandler()?.($event)">
              <span x-html="table.FlexRender({ header })"></span>
            </th>
          </template>
        </tr>
      </template>
    </thead>
    <tbody>
      <template x-for="row in table.getRowModel().rows" :key="row.id">
        <tr>
          <template x-for="cell in row.getAllCells()" :key="cell.id">
            <td x-html="table.FlexRender({ cell })"></td>
          </template>
        </tr>
      </template>
    </tbody>
  </table>
</div>
```

## Override Shared Defaults Per Table

Options passed to `createAppTable` override defaults from `createTableHook`. Use this for the few tables that need different behavior without creating a separate app hook.

```ts
const table = createAppTable({
  columns,
  get data() {
    return local.data
  },
  enableSortingRemoval: true, // override the hook default for this table only
})
```

## When To Use This Pattern

Use `createTableHook` when multiple tables should share features, row models, default options, or conventions. Use the standalone `createTable` API for a one-off table.
