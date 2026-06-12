---
title: Composable Tables Guide
---

Composable tables are app-level table factories built with `createTableHook`. Instead of repeating the same features, row models, default options, and table/cell/header components in every Angular table, you define that shared infrastructure once and consume it from each table component.

Use this pattern when multiple tables in an Angular app share behavior or rendering conventions. For a single isolated table, `injectTable` is usually enough.

## Examples

- [Composable Tables](../examples/composable-tables) - Two tables sharing one app table setup from `src/app/table.ts`.
- [Basic App Table](../examples/basic-app-table) - Minimal `createTableHook` usage without the larger component registry.

## Setup

The composable tables example keeps the shared setup in `src/app/table.ts`. That file creates one app-specific table factory and exports the helpers used by the rest of the example.

```ts
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFns,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/angular-table'

import {
  PaginationControls,
  RowCount,
  TableToolbar,
} from './components/table-components'
import {
  CategoryCell,
  NumberCell,
  PriceCell,
  ProgressCell,
  RowActionsCell,
  StatusCell,
  TextCell,
} from './components/cell-components'
import {
  ColumnFilter,
  FooterColumnId,
  FooterSum,
  SortIndicator,
} from './components/header-components'

const features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
  filterFns,
})

export const {
  createAppColumnHelper,
  injectAppTable,
  injectTableContext,
  injectTableCellContext,
  injectTableHeaderContext,
} = createTableHook({
  features,
  getRowId: (row) => row.id,
  tableComponents: {
    PaginationControls,
    RowCount,
    TableToolbar,
  },
  cellComponents: {
    TextCell,
    NumberCell,
    ProgressCell,
    StatusCell,
    CategoryCell,
    PriceCell,
    RowActionsCell,
  },
  headerComponents: {
    SortIndicator,
    ColumnFilter,
    FooterColumnId,
    FooterSum,
  },
})
```

This file is the source of truth for the feature set, row model pipeline, row IDs, and registered components used by both tables in the example.

## Returned Helpers

| Helper | Purpose |
|---|---|
| `injectAppTable` | Creates a table with the app's shared `features` (including row model factories), defaults, and registered components already attached. |
| `createAppColumnHelper` | Creates column helpers where `cell`, `header`, and `footer` contexts know about the registered components. |
| `injectTableContext` | Reads the current table inside registered table components like `PaginationControls`. |
| `injectTableCellContext` | Reads the current cell inside registered cell components like `TextCell`. |
| `injectTableHeaderContext` | Reads the current header/footer inside registered header components like `SortIndicator`. |

## Columns

Use `createAppColumnHelper<TData>()` instead of the base column helper when column definitions should render registered components.

```ts
import { flexRenderComponent } from '@tanstack/angular-table'
import { createAppColumnHelper } from '../../table'
import type { Person } from '../../makeData'

const personColumnHelper = createAppColumnHelper<Person>()

readonly columns = personColumnHelper.columns([
  personColumnHelper.accessor('firstName', {
    header: 'First Name',
    footer: ({ header }) => flexRenderComponent(header.FooterColumnId),
    cell: ({ cell }) => flexRenderComponent(cell.TextCell),
  }),
  personColumnHelper.accessor('age', {
    header: 'Age',
    footer: ({ header }) => flexRenderComponent(header.FooterSum),
    cell: ({ cell }) => flexRenderComponent(cell.NumberCell),
  }),
])
```

The registered components are available through the enhanced `cell` and `header` objects because the column helper is bound to the `createTableHook` configuration.

## Table Rendering

Create each table with `injectAppTable`. Per-table options provide the data and columns; shared features and row models come from `src/app/table.ts`.

```ts
table = injectAppTable(() => ({
  key: 'users-table',
  columns: this.columns,
  data: this.data(),
  debugTable: true,
}))
```

The Angular table instance is augmented with:

- `table.PaginationControls`, `table.RowCount`, and `table.TableToolbar`
- `table.appCell(cell)` for enhanced cell component types in templates
- `table.appHeader(header)` for enhanced header component types in templates
- `table.appFooter(footer)` for enhanced footer component types in templates

Registered table components can access the table through Angular DI:

```ts
export class PaginationControls {
  readonly table = injectTableContext()
}
```

In templates, use the Angular rendering helpers with the app wrappers:

```html
@for (_header of headerGroup.headers; track _header.id) {
  @let header = table.appHeader(_header);

  <th (click)="header.column.getToggleSortingHandler()?.($event)">
    <ng-container *flexRenderHeader="header; let value">
      {{ value }}
    </ng-container>
    <ng-container
      *flexRender="header.SortIndicator; props: header.getContext(); let value"
    >
      {{ value }}
    </ng-container>
  </th>
}
```

## Reusing The Hook

The example has separate Users and Products table components. Both import `createAppColumnHelper` and `injectAppTable` from `src/app/table.ts`, so they share sorting, filtering, pagination, row IDs, toolbar controls, cell renderers, and header/footer renderers while keeping their own data and columns.

If different product areas need incompatible defaults, create another `createTableHook` setup file and export a second set of app helpers from there.
