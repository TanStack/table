---
title: Quick Start
---

TanStack Table is a headless table library. It manages your table's state and logic (sorting, filtering, pagination, selection, and more) while you keep 100% control over the markup and styles. This page gets you from install to a rendering Alpine table, then shows how to layer on your first feature.

## Installation

```bash
npm install @tanstack/alpine-table alpinejs
```

The `@tanstack/alpine-table` package works with Alpine 3.

## How the Alpine adapter works

The adapter is built around two ideas:

- **`createTable` returns a reactive table instance.** State lives in [TanStack Store](https://tanstack.com/store/latest) atoms that the adapter bridges into Alpine's reactivity. Any Alpine binding that reads a table API (`table.getRowModel()`, `table.atoms.sorting.get()`, and so on) re-runs automatically when the underlying state changes. There is no state selector to pass.
- **You render with `x-html` and `table.FlexRender`.** A column's `cell`/`header`/`footer` renderer returns a string of HTML. `table.FlexRender({ cell })` produces that string and you place it with `x-html`.

> [!IMPORTANT]
> Alpine does not initialize directives (`@click`, `x-model`, etc.) inside content set with `x-html`. So render cell/header **content** with `x-html="table.FlexRender(...)"`, but put any **interactivity** (click-to-sort, filter inputs, checkboxes) on real elements in your markup, next to the `x-html` span. You will see this pattern in the sorting example below.

## Your First Table

You define the table in a JavaScript module with [`Alpine.data`](https://alpinejs.dev/globals/alpine-data), then render it from your HTML.

```ts
// main.ts
import Alpine from 'alpinejs'
import { FlexRender, createTable, tableFeatures } from '@tanstack/alpine-table'
import type { ColumnDef } from '@tanstack/alpine-table'

// 1. Define the shape of your data
type Person = {
  firstName: string
  lastName: string
  age: number
}

const defaultData: Array<Person> = [
  { firstName: 'tanner', lastName: 'linsley', age: 24 },
  { firstName: 'tandy', lastName: 'miller', age: 40 },
  { firstName: 'joe', lastName: 'dirte', age: 45 },
]

// 2. New in v9: declare which features this table uses (none yet)
const features = tableFeatures({})

// 3. Define your columns. Renderers return HTML strings (rendered via x-html).
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName', // accessorKey shorthand
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName, // accessorFn alternative with a custom id
    id: 'lastName',
    header: () => '<span>Last Name</span>',
    cell: (info) => `<i>${info.getValue<string>()}</i>`,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
  },
]

// 4. Register an Alpine component
Alpine.data('table', () => {
  // Store data in Alpine-reactive state so updates flow into the table
  const local = Alpine.reactive({ data: defaultData })

  // 5. Create the table instance, reading data through a getter so it stays reactive
  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
  })

  // Expose the instance (and FlexRender) to the template
  return { table, FlexRender }
})

window.Alpine = Alpine
Alpine.start()
```

```html
<!-- index.html -->
<div x-data="table">
  <table>
    <thead>
      <template
        x-for="headerGroup in table.getHeaderGroups()"
        :key="headerGroup.id"
      >
        <tr>
          <template x-for="header in headerGroup.headers" :key="header.id">
            <th>
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
          <template x-for="cell in row.getAllCells()" :key="cell.id">
            <td x-html="FlexRender({ cell })"></td>
          </template>
        </tr>
      </template>
    </tbody>
  </table>
</div>
<script type="module" src="/main.ts"></script>
```

A few things to note:

- `tableFeatures({})` declares which optional features the table uses. Registering only what you need keeps bundles small and gives TypeScript accurate types for the table instance.
- The core row model is always included automatically. Feature row models (sorting, filtering, pagination) are registered as slots directly on the `tableFeatures({...})` call when you need them.
- The `get data()` getter keeps the table reactive. When `local.data` is reassigned, the table sees the new data. Passing `data: local.data` would capture a one-time snapshot.
- `FlexRender` is also attached to the instance as `table.FlexRender`, so you can write `x-html="table.FlexRender({ cell })"` instead of exposing the top-level helper.

See the full [Basic createTable example](./examples/basic-create-table) for a runnable version with more columns and a footer.

## Add a Feature: Sorting

Features are opt-in in v9. To make columns sortable, register `rowSortingFeature` and the `sortedRowModel` factory in `tableFeatures`, then wire a header click handler. Because the click handler cannot live inside `x-html`, wrap the rendered header in a real element and attach `@click` there.

```ts
// main.ts (additions)
import {
  FlexRender,
  createSortedRowModel,
  createTable,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/alpine-table'

const features = tableFeatures({
  rowSortingFeature, // enables sorting APIs and state
  sortedRowModel: createSortedRowModel(), // client-side sorting
  sortFns,
})

// columns and the Alpine.data registration are otherwise unchanged
```

```html
<!-- index.html: the <thead> becomes -->
<thead>
  <template
    x-for="headerGroup in table.getHeaderGroups()"
    :key="headerGroup.id"
  >
    <tr>
      <template x-for="header in headerGroup.headers" :key="header.id">
        <th>
          <template x-if="!header.isPlaceholder">
            <div
              :style="header.column.getCanSort() ? 'cursor: pointer' : ''"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <span x-html="FlexRender({ header })"></span
              ><span
                x-text="({ asc: ' 🔼', desc: ' 🔽' })[header.column.getIsSorted()] ?? ''"
              ></span>
            </div>
          </template>
        </th>
      </template>
    </tr>
  </template>
</thead>
```

Clicking a header now toggles between ascending, descending, and unsorted. Every other feature follows this same pattern: register the feature (and its row model factory as a slot on `tableFeatures` if it has one), then use the APIs it adds to the table, columns, and rows, attaching any interactive controls to real elements in your markup. See the [Sorting example](./examples/sorting) for custom sort functions, multi-sorting, and per-column options.

## Where to Go Next

**Table state.** In v9, table state is backed by TanStack Store atoms, which the adapter makes reactive in Alpine. You usually do not need to manage it yourself. Set `initialState` for starting values and call feature APIs like `table.setSorting(...)` or `table.nextPage()`. When you need to read a state slice in your markup, use `table.atoms.<slice>.get()` (for example `table.atoms.pagination.get().pageIndex`) or `table.store.get()` for the whole state. There is no state selector, because the table instance is already reactive. The [Table State Guide](./guide/table-state.md) is the foundational guide for everything else.

**Feature examples.** Each feature has a runnable example, such as [Column Filters](./examples/filters), [Pagination](./examples/pagination), [Row Selection](./examples/row-selection), and [Column Visibility](./examples/column-visibility).

**Composable tables.** When multiple tables in your app share features and row models, define them once with `createTableHook`:

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const { createAppTable, createAppColumnHelper } = createTableHook({ features })
```

Then call `createAppTable({ columns, data })` from your component instead of `createTable`, and define columns with `createAppColumnHelper`. See the [Basic createAppTable example](./examples/basic-app-table) for the full pattern.

**Examples.** Browse the runnable [Alpine examples](./examples/basic-create-table), from basic tables to feature demos, to see intended usage end to end.
