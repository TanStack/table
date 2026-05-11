---
title: Angular Table
---

The `@tanstack/angular-table` adapter wraps `@tanstack/table-core` with Angular signals, rendering directives, dependency-injection helpers, and types. `injectTable` supplies Angular reactivity bindings for you, so table atoms can update Angular signals, computed values, effects, and templates.

TanStack Table v9 is explicit about what a table uses. Register features with `_features`, and register client-side row model factories with `_rowModels`. The core row model is included by default, so a basic table can use `_rowModels: {}`.

## Creating a Table

Use `injectTable` inside an Angular injection context. The initializer is re-run when Angular signals read inside it change, then the adapter syncs the table options.

```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  FlexRender,
  injectTable,
  tableFeatures,
  type ColumnDef,
} from '@tanstack/angular-table'

type Person = {
  firstName: string
  lastName: string
  age: number
}

const _features = tableFeatures({})

const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    accessorKey: 'firstName',
    header: 'First name',
    cell: (info) => info.getValue(),
  },
]

@Component({
  selector: 'app-root',
  imports: [FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal<Person[]>([])

  readonly table = injectTable(() => ({
    _features,
    _rowModels: {},
    columns,
    data: this.data(),
  }))
}
```

For feature-specific row models, register the feature and put the row model factory under `_rowModels`.

```ts
import {
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/angular-table'

const _features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
})

const tableOptions = {
  _features,
  _rowModels: {
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(sortFns),
  },
}
```

## Table State

Table state is managed with TanStack Store atoms in v9. For most tables, you do not need to manage table state yourself: set `initialState` when you need starting values, and use feature APIs like `table.nextPage()`, `table.setSorting(...)`, and `row.toggleSelected()` instead of mutating state directly.

Angular apps usually own state with signals and pass it through `state` with the matching `on[State]Change` option. The `atoms` table option is also available for TanStack Store atom ownership. Table atoms are backed by Angular signals, so reading `table.atoms.someSlice.get()` in a template, `computed(...)`, or `effect(...)` participates in Angular reactivity.

```ts
import { signal } from '@angular/core'
import {
  injectTable,
  rowPaginationFeature,
  tableFeatures,
  type PaginationState,
} from '@tanstack/angular-table'

const _features = tableFeatures({
  rowPaginationFeature,
})

export class App {
  readonly pagination = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  readonly table = injectTable(() => ({
    _features,
    _rowModels: {},
    columns,
    data: this.data(),
    state: {
      pagination: this.pagination(),
    },
    onPaginationChange: (updater) => {
      this.pagination.update((old) =>
        updater instanceof Function ? updater(old) : updater,
      )
    },
  }))
}
```

See the [Table State Guide](./guide/table-state.md) for reactive reads, external atoms, and state ownership patterns.

## Rendering Headers, Cells, and Footers

Use the `FlexRender` directive helpers to render column `header`, `cell`, and `footer` definitions. They handle primitive values, templates, and components wrapped with `flexRenderComponent`.

```html
<tbody>
  @for (row of table.getRowModel().rows; track row.id) {
    <tr>
      @for (cell of row.getVisibleCells(); track cell.id) {
        <td *flexRenderCell="cell; let rendered">
          {{ rendered }}
        </td>
      }
    </tr>
  }
</tbody>
```

For `*flexRender`, `*flexRenderHeader`, `*flexRenderFooter`, `flexRenderComponent`, and render context helpers, see the [Rendering components Guide](./guide/rendering.md).

## createTableHook

`createTableHook` creates app-specific Angular table helpers. Use it when multiple tables should share `_features`, `_rowModels`, default options, column helpers, and component conventions.

```ts
import { createTableHook, tableFeatures } from '@tanstack/angular-table'

const { injectAppTable, createAppColumnHelper } = createTableHook({
  _features: tableFeatures({}),
  _rowModels: {},
})

const columnHelper = createAppColumnHelper<Person>()

export class App {
  readonly table = injectAppTable(() => ({
    columns,
    data: this.data(),
  }))
}
```

See the [Table Composition Guide](./guide/table-composition.md) and the [Composable Tables example](./examples/composable-tables) for the full pattern.

## API Reference

See the [Angular API Reference](./reference/index.md).
