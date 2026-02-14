---
title: Composable Tables (Angular) Guide
---

## Composable Tables

`createTableHook` is a convenience API for creating reusable, type-safe table configurations with pre-bound components. It is inspired by [TanStack Form's `createFormHook`](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition) — a pattern where you define shared infrastructure once and consume it across your application with minimal boilerplate.

### createTableHook

`createTableHook` centralize your table configuration into a single factory call. It returns a set of typed functions — `injectAppTable`, `createAppColumnHelper`, and pre-typed injection helpers — that you use instead of the base APIs.

```ts
import {
  createTableHook,
  tableFeatures,
  // features
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  // row models
  createSortedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  sortFns,
  filterFns,
} from '@tanstack/angular-table'
```

## Setup

Call `createTableHook` with your shared configuration and destructure the returned utilities:

```ts
// table.ts — shared table infrastructure

import {
  createTableHook,
  tableFeatures,
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
} from '@tanstack/angular-table'

import { PaginationControls, RowCount, TableToolbar } from './components/table-components'
import { TextCell, NumberCell, StatusCell, ProgressCell } from './components/cell-components'
import { SortIndicator, ColumnFilter } from './components/header-components'

export const {
  createAppColumnHelper,
  injectAppTable,
  injectTableContext,
  injectTableCellContext,
  injectTableHeaderContext,
} = createTableHook({
  // Features and row models are shared across all tables
  _features: tableFeatures({
    columnFilteringFeature,
    rowPaginationFeature,
    rowSortingFeature,
  }),
  _rowModels: {
    sortedRowModel: createSortedRowModel(sortFns),
    filteredRowModel: createFilteredRowModel(filterFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
  // Default table options applied to every table
  getRowId: (row) => row.id,

  // Pre-bound component registries
  tableComponents: {
    PaginationControls,
    RowCount,
    TableToolbar,
  },
  cellComponents: {
    TextCell,
    NumberCell,
    StatusCell,
    ProgressCell,
  },
  headerComponents: {
    SortIndicator,
    ColumnFilter,
  },
})
```

This single file becomes the source of truth for your application's table infrastructure.

## What `createTableHook` returns

| Export | Description |
|---|---|
| `injectAppTable` | A wrapper around `injectTable` that merges default options and attaches component registries. Returns an `AppAngularTable` with table/cell/header components available directly on the instance. |
| `createAppColumnHelper` | A typed column helper where `cell`, `header`, and `footer` definitions receive enhanced context types with the registered components. |
| `injectTableContext` | Pre-typed `injectTableContext()` bound to your feature set. |
| `injectTableCellContext` | Pre-typed `injectTableCellContext()` bound to your feature set. |
| `injectTableHeaderContext` | Pre-typed `injectTableHeaderContext()` bound to your feature set. |
| `injectFlexRenderCellContext` | Pre-typed `injectFlexRenderContext()` for cell context. |
| `injectFlexRenderHeaderContext` | Pre-typed `injectFlexRenderContext()` for header context. |

## Component registries

`createTableHook` accepts three component registries that map string keys to Angular components or render functions:

### `tableComponents`

Components that need access to the **table instance**. These are attached directly to the `AppAngularTable` object returned by `injectAppTable`, so you can reference them in templates as `table.PaginationControls`, `table.RowCount`, etc.

Use `injectTableContext()` inside these components to access the table:

```ts
@Component({
  selector: 'app-pagination-controls',
  template: `
    <div class="pagination">
      <button (click)="table().previousPage()" [disabled]="!table().getCanPreviousPage()">
        Previous
      </button>
      <button (click)="table().nextPage()" [disabled]="!table().getCanNextPage()">
        Next
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationControls {
  readonly table = injectTableContext()
}
```

Render table components via Angular `NgComponentOutlet`:

```html
<ng-container *ngComponentOutlet="table.PaginationControls" />
<ng-container *ngComponentOutlet="table.RowCount" />
<ng-container
  *ngComponentOutlet="table.TableToolbar; inputs: { title: 'Users', onRefresh }"
/>
```

### `cellComponents`

Components that render **cell content**. These are attached to the `Cell` prototype, so they are available in column definitions through the enhanced `AppCellContext`:

```ts
const columnHelper = createAppColumnHelper<Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: ({ cell }) => cell.TextCell,
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    cell: ({ cell }) => cell.NumberCell,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: ({ cell }) => cell.StatusCell,
  }),
])
```

Use `injectTableCellContext()` or `injectFlexRenderContext()` inside cell components:

```ts
@Component({
  selector: 'span',
  template: `{{ cell().getValue() }}`,
})
export class TextCell {
  readonly cell = injectTableCellContext<string>()
}
```

### `headerComponents`

Components or render functions that render **header/footer content**. These are attached to the `Header` prototype and available through the enhanced `AppHeaderContext`:

```ts
// Render functions work too — they run in injection context
export function SortIndicator(): string | null {
  const header = injectTableHeaderContext()
  const sorted = header().column.getIsSorted()
  if (!sorted) return null
  return sorted === 'asc' ? '🔼' : '🔽'
}
```

Access header components in the template via `table.appHeader(header)`:

```html
@for (_header of headerGroup.headers; track _header.id) {
  @let header = table.appHeader(_header);
  <th (click)="header.column.toggleSorting()">
    <ng-container *flexRenderHeader="header; let value">{{ value }}</ng-container>
    <ng-container *flexRender="header.SortIndicator; props: header.getContext(); let value">
      <div [innerHTML]="value"></div>
    </ng-container>
  </th>
}
```

## Using `injectAppTable`

`injectAppTable` is a wrapper around `injectTable`. It merges the default options from `createTableHook` with the per-table options, and returns an `AppAngularTable` — the standard table instance augmented with:

- **Table components** directly on the table object (`table.PaginationControls`, `table.TableToolbar`, etc.)
- **`table.appCell(cell)`** — utility type functions for templates that wraps a `Cell` with the registered `cellComponents`
- **`table.appHeader(header)`** — utility type functions for templates that wraps a `Header` with the registered `headerComponents`
- **`table.appFooter(footer)`** — utility type functions for templates that wraps a `Header` (footer) with the registered `headerComponents`

You do not need to pass `_features` or `_rowModels` — they are inherited from the hook configuration:

```ts
@Component({
  selector: 'users-table',
  templateUrl: './users-table.html',
  imports: [FlexRender, TanStackTable, TanStackTableHeader, TanStackTableCell, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersTable {
  readonly data = signal(makeData(100))

  readonly columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: 'First Name',
      cell: ({ cell }) => cell.TextCell,
    }),
    // ...
  ])

  // No need to specify _features, _rowModels, ... — they come from createTableHook
  table = injectAppTable(() => ({
    columns: this.columns,
    data: this.data(),
  }))
}
```

## Using `createAppColumnHelper`

`createAppColumnHelper<TData>()` returns a column helper identical to `createColumnHelper` at runtime, but with enhanced types: the `cell`, `header`, and `footer` definition callbacks receive `AppCellContext` / `AppHeaderContext` instead of the base context types.

This means TypeScript knows about your registered components and provides autocompletion:

```ts
const columnHelper = createAppColumnHelper<Person>()

columnHelper.accessor('firstName', {
  cell: ({ cell }) => {
    // ✅ TypeScript knows about TextCell, NumberCell, StatusCell, etc.
    return cell.TextCell
  },
  header: ({ header }) => {
    // ✅ TypeScript knows about SortIndicator, ColumnFilter, etc.
    return flexRenderComponent(header.SortIndicator)
  },
})
```

You can also use `flexRenderComponent(...)` to wrap the component with custom inputs/outputs:

```ts
columnHelper.accessor('firstName', {
  cell: ({ cell }) => flexRenderComponent(cell.TextCell),
  footer: ({ header }) => flexRenderComponent(header.FooterColumnId),
})
```

## Multiple table configurations

You can call `createTableHook` multiple times to create different table configurations for different parts of your application. Each call returns an independent set of utilities with its own feature set and component registries:

```ts
// admin-table.ts — tables with editing capabilities
export const {
  injectAppTable: injectAdminTable,
  createAppColumnHelper: createAdminColumnHelper,
} = createTableHook({
  _features: tableFeatures({ rowSortingFeature, columnFilteringFeature }),
  _rowModels: { /* ... */ },
  cellComponents: { EditableCell, DeleteButton },
})

// readonly-table.ts — simpler read-only tables
export const {
  injectAppTable: injectReadonlyTable,
  createAppColumnHelper: createReadonlyColumnHelper,
} = createTableHook({
  _features: tableFeatures({ rowSortingFeature }),
  _rowModels: { /* ... */ },
  cellComponents: { TextCell, NumberCell },
})
```

## Examples

- [Composable Tables](../../examples/angular/composable-tables) — full example with two tables sharing the same `createTableHook` configuration, including table/cell/header component registries, sorting, filtering, and pagination.
- [Basic App Table](../../examples/angular/basic-app-table) — minimal example using `createTableHook` with no pre-bound components.
