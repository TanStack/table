---
title: Quick Start
---

TanStack Table is a headless table library. It manages your table's state and logic (sorting, filtering, pagination, selection, and more) while you keep 100% control over the markup and styles. This page gets you from install to a rendering Lit table, then shows how to layer on your first feature.

## Installation

TanStack Table v9 is currently published under the `beta` tag:

```bash
npm install @tanstack/lit-table@beta
```

## Your First Table

The component below is complete. Paste it into a Lit app and you will see a working table. The `@tanstack/lit-table` adapter is built around `TableController`, a Lit `ReactiveController` that constructs the table once, subscribes the host to state changes, and gives you a fresh table instance on each render pass.

```ts
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { FlexRender, TableController, tableFeatures } from '@tanstack/lit-table'
import type { ColumnDef } from '@tanstack/lit-table'

// 1. Define the shape of your data
type Person = {
  firstName: string
  lastName: string
  age: number
}

// 2. New in v9: declare which features this table uses (none yet)
const features = tableFeatures({})

// 3. Define your columns
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName', // accessorKey shorthand
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName, // accessorFn alternative with a custom id
    id: 'lastName',
    header: () => html`<span>Last Name</span>`,
    cell: (info) => html`<i>${info.getValue<string>()}</i>`,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
  },
]

@customElement('person-table')
export class PersonTable extends LitElement {
  // 4. Store your data in a reactive property
  @state()
  private data: Array<Person> = [
    { firstName: 'tanner', lastName: 'linsley', age: 24 },
    { firstName: 'tandy', lastName: 'miller', age: 40 },
    { firstName: 'joe', lastName: 'dirte', age: 45 },
  ]

  // 5. Create one TableController for the host element
  private tableController = new TableController<typeof features, Person>(this)

  protected render() {
    // 6. Create the table instance during render
    const table = this.tableController.table(
      {
        features,
        columns,
        data: this.data,
      },
      () => ({}), // state selector, empty since we use no feature state yet
    )

    // 7. Render markup from the table instance APIs
    return html`
      <table>
        <thead>
          ${repeat(
            table.getHeaderGroups(),
            (headerGroup) => headerGroup.id,
            (headerGroup) => html`
              <tr>
                ${repeat(
                  headerGroup.headers,
                  (header) => header.id,
                  (header) => html`
                    <th>
                      ${header.isPlaceholder ? null : FlexRender({ header })}
                    </th>
                  `,
                )}
              </tr>
            `,
          )}
        </thead>
        <tbody>
          ${repeat(
            table.getRowModel().rows,
            (row) => row.id,
            (row) => html`
              <tr>
                ${repeat(
                  row.getAllCells(),
                  (cell) => cell.id,
                  (cell) => html`<td>${FlexRender({ cell })}</td>`,
                )}
              </tr>
            `,
          )}
        </tbody>
      </table>
    `
  }
}
```

A few things to note:

- `tableFeatures({})` declares which optional features the table uses. Registering only what you need keeps bundles small and gives TypeScript accurate types for the table instance.
- The core row model is always included automatically. Feature row models (sorting, filtering, pagination) are registered as slots directly on the `tableFeatures({...})` call when you need them.
- `FlexRender` renders the `header`, `cell`, and `footer` definitions from your columns, whether they are plain values or Lit templates. It is also attached to the instance as `table.FlexRender` if you prefer not to import it.
- The second argument to `tableController.table(...)` is a state selector. It controls what `table.state` contains; an empty selector is fine until you use feature state.

See the full [Basic TableController example](./examples/basic-table-controller) for a runnable version with more columns and a footer.

## Add a Feature: Sorting

Features are opt-in in v9. To make columns sortable, register `rowSortingFeature` and the `sortedRowModel` factory in `tableFeatures`, then wire the header click handler.

```ts
import {
  FlexRender,
  TableController,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'

const features = tableFeatures({
  rowSortingFeature, // enables sorting APIs and state
  sortedRowModel: createSortedRowModel(), // client-side sorting
  sortFns,
})

@customElement('person-table')
export class PersonTable extends LitElement {
  // data and tableController unchanged from above

  protected render() {
    const table = this.tableController.table(
      {
        features,
        columns,
        data: this.data,
      },
      (state) => ({ sorting: state.sorting }), // select the sorting state
    )

    return html`
      <table>
        <thead>
          ${repeat(
            table.getHeaderGroups(),
            (headerGroup) => headerGroup.id,
            (headerGroup) => html`
              <tr>
                ${repeat(
                  headerGroup.headers,
                  (header) => header.id,
                  (header) => html`
                    <th>
                      ${header.isPlaceholder
                        ? null
                        : html`<div
                            @click=${header.column.getToggleSortingHandler()}
                            style="cursor: ${header.column.getCanSort()
                              ? 'pointer'
                              : 'default'}"
                          >
                            ${FlexRender({ header })}
                            ${{ asc: ' 🔼', desc: ' 🔽' }[
                              header.column.getIsSorted() as string
                            ] ?? null}
                          </div>`}
                    </th>
                  `,
                )}
              </tr>
            `,
          )}
        </thead>
        <!-- tbody unchanged from above -->
      </table>
    `
  }
}
```

Clicking a header now toggles between ascending, descending, and unsorted. Every other feature follows this same pattern: register the feature (and its row model factory as a slot on `tableFeatures` if it has one), then use the APIs it adds to the table, columns, and rows. See the [Sorting Guide](./guide/sorting.md) and the [Sorting example](./examples/sorting) for custom sort functions, multi-sorting, and per-column options.

## Where to Go Next

**Table state.** In v9, table state is backed by TanStack Store atoms. You usually do not need to manage it yourself: set `initialState` for starting values and call feature APIs like `table.setSorting(...)` or `table.nextPage()`. When your app should own a state slice (via the `atoms` option), or you want fine-grained subscriptions, read the [Table State Guide](./guide/table-state.md). It is the foundational guide for everything else.

**Feature guides.** Each feature has its own guide, such as [Column Filtering](./guide/column-filtering.md), [Pagination](./guide/pagination.md), [Row Selection](./guide/row-selection.md), and [Column Visibility](./guide/column-visibility.md).

**Composable tables.** When multiple tables in your app share features, row models, and component conventions, define them once with `createTableHook`:

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const { useAppTable, createAppColumnHelper } = createTableHook({ features })
```

Then call `useAppTable(this, { columns, data })` from your components instead of managing a `TableController` directly. See the [Composable Tables Guide](./guide/composable-tables.md) for the full pattern, including pre-bound cell and header components.

**Examples.** Browse the runnable [Lit examples](./examples/basic-table-controller), from basic tables to feature demos, to see intended usage end to end.
