---
title: Quick Start
---

TanStack Table is a headless table library. It manages your table's state and logic (sorting, filtering, pagination, selection, and more) while you keep 100% control over the markup and styles. This page gets you from install to a rendering Ember table, then shows how to layer on your first feature.

## Installation

```bash
npm install @tanstack/ember-table
```

`@tanstack/ember-table` is a v2 addon that requires Ember 5.8+ with Embroider (or ember-auto-import v2). It works with `.gts`/`.gjs` template tag components and Glint.

## How the Ember adapter works

The adapter is built around two ideas:

- **`useTable` returns a reactive table instance.** State lives in [TanStack Store](https://tanstack.com/store/latest) atoms that the adapter bridges into Glimmer's tracking system with an Ember-native reactivity feature. You pass options as a thunk (`useTable(() => ({ ... }))`); any tracked property the thunk reads (like `this.data`) re-runs the table when it changes, and any template or getter that reads a table API re-renders automatically.
- **You render cells with the `FlexRenderCell`, `FlexRenderHeader`, and `FlexRenderFooter` components.** A column's `cell`/`header`/`footer` renderer can return a plain value or a component via `flexRenderComponent`, and the FlexRender components place it in your markup.

> [!IMPORTANT]
> TanStack Table v9 uses prototype-based methods that require `this` binding. Ember templates extract function references without binding them, so wrap table and column method calls in small helper functions (or getters) instead of calling them directly in templates. You will see this pattern in the sorting example below.

## Your First Table

Define your table in a Glimmer component with the template tag format:

```gts
import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  tableFeatures,
  createColumnHelper,
  type Row,
  type Cell,
} from '@tanstack/ember-table'

// 1. Define the shape of your data
interface Person {
  firstName: string
  lastName: string
  age: number
}

const data: Array<Person> = [
  { firstName: 'Tanner', lastName: 'Linsley', age: 33 },
  { firstName: 'Kevin', lastName: 'Vandy', age: 27 },
]

// 2. Opt in to the features you need (none yet)
const features = tableFeatures({})

// 3. Define your columns with the column helper
const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    cell: (info) => info.renderValue(),
  }),
])

// 4. Template helpers: ember templates extract methods unbound, so wrap
//    table/row method calls that need `this`
const getAllCells = (
  row: Row<typeof features, Person>,
): Array<Cell<typeof features, Person>> => row.getAllCells()

// 5. Create the table and render it
export default class PersonTable extends Component {
  @tracked data = data

  table = useTable(() => ({
    features,
    columns,
    data: this.data,
  }))

  get headerGroups() {
    return this.table.getHeaderGroups()
  }

  get rows() {
    return this.table.getRowModel().rows
  }

  <template>
    <table>
      <thead>
        {{#each this.headerGroups as |headerGroup|}}
          <tr>
            {{#each headerGroup.headers as |header|}}
              <th colspan={{header.colSpan}}>
                {{#unless header.isPlaceholder}}
                  <FlexRenderHeader @header={{header}} />
                {{/unless}}
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
}
```

Because `data` is `@tracked` and the options thunk reads `this.data`, assigning a new array re-runs the row model and re-renders the table.

## Adding a Feature: Sorting

Features are opt-in. Import the feature and its row model, add them to `tableFeatures`, and wire up a click handler:

```gts
import { on } from '@ember/modifier'
import {
  useTable,
  FlexRenderCell,
  FlexRenderHeader,
  tableFeatures,
  createColumnHelper,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
  type Column,
} from '@tanstack/ember-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

// Helpers keep `this` bound correctly when called from templates
const getCanSort = (column: Column<typeof features, Person>): boolean =>
  column.getCanSort()

const toggleSort = (column: Column<typeof features, Person>) => {
  return (event: Event) => {
    column.getToggleSortingHandler()?.(event)
  }
}
```

Then attach the handler in your header markup:

```hbs
<th colspan={{header.colSpan}}>
  {{#unless header.isPlaceholder}}
    <div
      {{on 'click' (toggleSort header.column)}}
      style='cursor: {{if (getCanSort header.column) "pointer" "default"}}'
    >
      <FlexRenderHeader @header={{header}} />
    </div>
  {{/unless}}
</th>
```

## Rendering Components in Cells

Return `flexRenderComponent` from a column's `cell` (or `header`/`footer`) definition to render a Glimmer component with custom arguments:

```gts
import Component from '@glimmer/component'
import {
  flexRenderComponent,
  type CellRenderableSignature,
} from '@tanstack/ember-table'

// Use `CellRenderableSignature` for a cell component: its `ctx` is a
// `CellContext`, so `ctx.getValue()` is available directly with no cast. Use
// `FlexRenderableSignature` only for a component rendered in both cell and
// header slots; its `ctx` is a cell-or-header union.
class StatusBadge extends Component<
  CellRenderableSignature<typeof features, Person, string, { color: string }>
> {
  get value(): string {
    return this.args.ctx.getValue()
  }

  <template>
    <span class='badge badge-{{@options.color}}'>{{this.value}}</span>
  </template>
}

const columns = columnHelper.columns([
  columnHelper.accessor('status', {
    header: 'Status',
    cell: () => flexRenderComponent(StatusBadge, { color: 'blue' }),
  }),
])
```

## Composable Tables

When multiple tables in your app share the same features, row models, and default options, define them once with `createTableHook` instead of repeating them at every call site:

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const { createAppTable, createAppColumnHelper } = createTableHook({ features })
```

Then call `createAppTable(() => ({ columns, data: this.data }))` from your component instead of `useTable` (it takes the same options thunk, minus `features`), and define columns with `createAppColumnHelper`. See the [Composable Tables Guide](./guide/composable-tables.md) and the [Basic createAppTable example](./examples/basic-app-table) for the full pattern.

## What to Read Next

- The [Table State](../../guide/tables.md) and [Row Models](../../guide/row-models.md) core guides explain how state and data flow work in v9.
- Browse the Ember examples in the sidebar for working feature demos (sorting, filtering, pagination, row selection, column pinning, and more).
