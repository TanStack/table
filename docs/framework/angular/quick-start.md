---
title: Quick Start
---

TanStack Table is a headless table library. It manages your table's state and logic (sorting, filtering, pagination, selection, and more) while you keep 100% control over the markup and styles. This page gets you from install to a rendering Angular table, then shows how to layer on your first feature.

## Installation

TanStack Table v9 is currently published under the `beta` tag:

```bash
npm install @tanstack/angular-table@beta
```

## Your First Table

The component and template below are complete. Drop them into an Angular app and you will see a working table.

```ts
// app.ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { FlexRender, injectTable, tableFeatures } from '@tanstack/angular-table'
import type { ColumnDef } from '@tanstack/angular-table'

// 1. Define the shape of your data
type Person = {
  firstName: string
  lastName: string
  age: number
}

// 2. Create some data with a stable reference
const defaultData: Array<Person> = [
  { firstName: 'tanner', lastName: 'linsley', age: 24 },
  { firstName: 'tandy', lastName: 'miller', age: 40 },
  { firstName: 'joe', lastName: 'dirte', age: 45 },
]

// 3. New in v9: declare which features this table uses (none yet)
const features = tableFeatures({})

// 4. Define your columns
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName', // accessorKey shorthand
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName, // accessorFn alternative with a custom id
    id: 'lastName',
    header: () => 'Last Name',
    cell: (info) => info.getValue<string>(),
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
  },
]

@Component({
  selector: 'app-root',
  imports: [FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  // 5. Own the data with a signal so updates flow into the table
  readonly data = signal<Array<Person>>([...defaultData])

  // 6. Create the table instance
  readonly table = injectTable(() => ({
    key: 'person-table', // registers this table with the devtools
    features,
    columns,
    data: this.data(),
  }))
}
```

```html
<!-- app.html -->
<table>
  <thead>
    @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
      <tr>
        @for (header of headerGroup.headers; track header.id) {
          <th>
            @if (!header.isPlaceholder) {
              <ng-container *flexRenderHeader="header; let headerCell">
                {{ headerCell }}
              </ng-container>
            }
          </th>
        }
      </tr>
    }
  </thead>
  <tbody>
    @for (row of table.getRowModel().rows; track row.id) {
      <tr>
        @for (cell of row.getAllCells(); track cell.id) {
          <td>
            <ng-container *flexRenderCell="cell; let renderCell">
              {{ renderCell }}
            </ng-container>
          </td>
        }
      </tr>
    }
  </tbody>
</table>
```

A few things to note:

- `tableFeatures({})` declares which optional features the table uses. Registering only what you need keeps bundles small and gives TypeScript accurate types for the table instance.
- `injectTable` must be called in an injection context. Its initializer re-runs when Angular signals read inside it change (like `this.data()` here), and the adapter syncs the table options.
- The `FlexRender` directives (`*flexRenderHeader`, `*flexRenderCell`, `*flexRenderFooter`) render the `header`, `cell`, and `footer` definitions from your columns, whether they are plain values, templates, or components. See the [Rendering Guide](./guide/rendering.md) for `flexRenderComponent` and render context helpers.
- The `key` option is optional unless you use the [TanStack Table Devtools](../../devtools). The devtools identify tables by `key`, and you register a table with `injectTanStackTableDevtools` from `@tanstack/angular-table-devtools`.

See the full [Basic injectTable example](./examples/basic-inject-table) for a runnable version with more columns and a footer.

## Add a Feature: Sorting

Features are opt-in in v9. To make columns sortable, register `rowSortingFeature` and the sorted row model in `tableFeatures`, then wire the header click handler in the template.

```ts
// app.ts
import {
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/angular-table'

const features = tableFeatures({
  rowSortingFeature, // enables sorting APIs and state
  sortedRowModel: createSortedRowModel(), // client-side sorting
  sortFns,
})

export class App {
  readonly data = signal<Array<Person>>([...defaultData])

  readonly table = injectTable(() => ({
    key: 'person-table',
    features,
    columns,
    data: this.data(),
  }))

  sortIndicator(sortDirection: false | 'asc' | 'desc') {
    if (sortDirection === 'asc') return ' 🔼'
    if (sortDirection === 'desc') return ' 🔽'
    return null
  }
}
```

```html
<!-- app.html: thead changes, tbody unchanged from above -->
<thead>
  @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
    <tr>
      @for (header of headerGroup.headers; track header.id) {
        <th>
          @if (!header.isPlaceholder) {
            <div
              [style.cursor]="header.column.getCanSort() ? 'pointer' : null"
              (click)="header.column.getToggleSortingHandler()?.($event)"
            >
              <ng-container *flexRenderHeader="header; let headerCell">
                {{ headerCell }}
              </ng-container>
              {{ sortIndicator(header.column.getIsSorted()) }}
            </div>
          }
        </th>
      }
    </tr>
  }
</thead>
```

Clicking a header now toggles between ascending, descending, and unsorted. Every other feature follows this same pattern: register the feature and its row model factory (when it has one) inside `tableFeatures`, then use the APIs it adds to the table, columns, and rows. See the [Sorting Guide](./guide/sorting.md) and the [Sorting example](./examples/sorting) for custom sort functions, multi-sorting, and per-column options.

## Where to Go Next

**Table state.** In v9, table state is backed by TanStack Store atoms, and table atoms are bridged to Angular signals for you. You usually do not need to manage state yourself: set `initialState` for starting values and call feature APIs like `table.setSorting(...)` or `table.nextPage()`. When your app should own a state slice, or you want fine-grained subscriptions, read the [Table State Guide](./guide/table-state.md). It is the foundational guide for everything else.

**Feature guides.** Each feature has its own guide, such as [Column Filtering](./guide/column-filtering.md), [Pagination](./guide/pagination.md), [Row Selection](./guide/row-selection.md), and [Column Visibility](./guide/column-visibility.md).

**Composable tables.** When multiple tables in your app share features, row models, and component conventions, define them once with `createTableHook`:

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const { injectAppTable, createAppColumnHelper } = createTableHook({ features })
```

See the [Composable Tables Guide](./guide/composable-tables.md) for the full pattern, including pre-bound cell and header components.

**Examples.** Browse the runnable [Angular examples](./examples/basic-inject-table), from basic tables to feature demos, to see intended usage end to end.
