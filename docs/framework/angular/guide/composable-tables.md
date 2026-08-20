---
title: Composable Tables (createTableHook) Guide
---

`createTableHook` creates an app-specific table factory. Use it to define shared features, row models, and default table options once, then create each Angular table with the columns and data that are unique to that table.

The same API can also register reusable table, cell, and header components, but component registration is optional. Start with shared options and features first; add reusable components only when your app needs standardized table UI pieces.

## Examples

- [Basic App Table](../examples/basic-app-table) - Minimal `createTableHook` usage without the larger component registry.
- [Composable Tables](../examples/composable-tables) - Richer Users and Products tables sharing `src/app/table.ts` and reusable components.

## Start With Shared Features and Options

Create one app table hook and put the feature set, row models, and shared defaults there. This example makes sorting available to every table created by `injectAppTable`.

```ts
import {
  createSortedRowModel,
  createTableHook,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/angular-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const { injectAppTable, createAppColumnHelper } = createTableHook({
  features,
  debugTable: true,
  enableSortingRemoval: false,
})
```

Options passed to `createTableHook` become defaults for every table created by `injectAppTable`. The `features` option is also bound to the returned column helper, so column definitions know that sorting APIs are available.

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

Create each table with `injectAppTable`. The call site provides table-specific inputs such as `columns` and `data`; shared features and defaults come from the hook.

```ts
export class UsersTable {
  readonly data = signal<Array<Person>>([])

  readonly table = injectAppTable(() => ({
    key: 'users-table',
    columns,
    data: this.data(),
  }))
}
```

## Render With The Normal Table APIs

You can render the table with the same table instance APIs used by a standalone `injectTable` table. This simple path does not require `appCell`, `appHeader`, `appFooter`, or registered components.

```html
<table>
  <thead>
    @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
    <tr>
      @for (header of headerGroup.headers; track header.id) {
      <th (click)="header.column.getToggleSortingHandler()?.($event)">
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

## Override Shared Defaults Per Table

Options passed to `injectAppTable` override defaults from `createTableHook`. Use this for the few tables that need different behavior without creating a separate app hook.

```ts
readonly table = injectAppTable(() => ({
  key: 'sortable-users-table',
  columns,
  data: this.data(),
  enableSortingRemoval: true,
}))
```

## Optional: Reusable Components

The richer composable-tables example also uses `createTableHook` as a component registry. Use this when several tables should share the same toolbar controls, cell renderers, header renderers, or footer renderers.

### Component Registry Setup

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

### Returned Helpers

| Helper                     | Purpose                                                                                                                                 |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `injectAppTable`           | Creates a table with the app's shared `features` (including row model factories), defaults, and registered components already attached. |
| `createAppColumnHelper`    | Creates column helpers where `cell`, `header`, and `footer` contexts know about the registered components.                              |
| `injectTableContext`       | Reads the current table inside registered table components like `PaginationControls`.                                                   |
| `injectTableCellContext`   | Reads the current cell inside registered cell components like `TextCell`.                                                               |
| `injectTableHeaderContext` | Reads the current header/footer inside registered header components like `SortIndicator`.                                               |

### Component Columns

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

### Component Table Rendering

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
@for (_header of headerGroup.headers; track _header.id) { @let header =
table.appHeader(_header);

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

### Reusing The Component Registry

The example has separate Users and Products table components. Both import `createAppColumnHelper` and `injectAppTable` from `src/app/table.ts`, so they share sorting, filtering, pagination, row IDs, toolbar controls, cell renderers, and header/footer renderers while keeping their own data and columns.

If different product areas need incompatible defaults, create another `createTableHook` setup file and export a second set of app helpers from there.

## When To Use This Pattern

Use `createTableHook` when multiple tables should share features, row models, default options, or conventions. Use the standalone `injectTable` API for a one-off table. Add the component registry only when the app wants standardized reusable table UI pieces.
