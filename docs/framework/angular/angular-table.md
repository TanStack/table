---
title: Angular Table
---

The `@tanstack/angular-table` adapter is a wrapper around the core table logic. Most of it's job is related to managing
state using angular signals, providing types and the rendering implementation of cell/header/footer templates.

## Exports

`@tanstack/angular-table` re-exports all of `@tanstack/table-core`'s APIs and the following:

### `injectTable`

Creates and returns an Angular-reactive table instance.

`injectTable` accepts either:

- an options function `() => TableOptions`
- a computed signal returning `TableOptions`

The initializer is intentionally re-evaluated whenever any signal read inside it changes.
This is how the adapter keeps the table in sync with Angular's reactivity model.

Because of that behavior, keep expensive/static values (for example `columns`, feature setup, row models) as stable references outside the initializer, and only read reactive state (`data()`, pagination/filter/sorting signals, etc.) inside it.

Since `ColumnDef` is stricter about generics, prefer building columns with `createColumnHelper<TFeatures, TData>()` so feature and row types are inferred consistently.

The returned table is also signal-reactive: table state and table APIs are wired for Angular signals, so you can safely consume table methods inside `computed(...)` and `effect(...)`.

```ts
import { computed, effect, signal } from '@angular/core'
import {
  createColumnHelper,
  injectTable,
  type ColumnDef,
} from '@tanstack/angular-table'

const _features = tableFeatures({
  // table features
})

const columnHelper = createColumnHelper<typeof _features, Person>()

export class AppComponent {
  readonly data = signal<Person[]>([])

  // If you type columns manually, include both generics:
  // readonly columns: ColumnDef<typeof _features, Person>[] = [...]
  readonly columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: 'First name',
      cell: info => info.getValue(),
    }),
    // ...
  ])

  // This function is re-run when any signal read inside changes.
  readonly table = injectTable(() => ({
    _features: _features,
    // Reactive state can be read directly
    data: this.data(),

    state: {
      // ...
    },

    // Keep stable references outside the initializer
    columns: this.columns,
  }))

  constructor() {
    effect(() => {
      console.log('Visible rows:', this.table.getRowModel().rows.length)
    })
  }
}

// ...render your table in template
```

### `createTableHook`

`createTableHook` is the Angular composition API for building reusable table infrastructure.

Use it when multiple tables should share the same defaults (features, row models, default options, and component registries) while keeping strong types across the app.

At runtime, `createTableHook` wraps `injectTable` and returns typed helpers such as:

- `injectAppTable` for creating tables with shared defaults
- `createAppColumnHelper` for strongly typed column definitions
- pre-typed context helpers (`injectTableContext`, `injectTableCellContext`, `injectTableHeaderContext`, `injectFlexRenderCellContext`, `injectFlexRenderHeaderContext`)

For full setup and patterns, see the [Composable Tables (Angular) Guide](./guide/composable-tables.md).

### `FlexRender`

An Angular structural rendering primitive for cell/header/footer content.

It supports the same content kinds as Angular rendering:

- primitive values (`string`, `number`, plain objects)
- `TemplateRef`
- component types
- `flexRenderComponent(component, options?)` wrappers with typed `inputs`, `outputs`, `injector`, `bindings`, and `directives`

Column render functions (`header`, `cell`, `footer`) run in Angular injection context, so you can use `inject()` and signals directly in render logic.

For complete rendering details (`*flexRender`, shorthand directives, `flexRenderComponent`, `TemplateRef`, component inputs/outputs, and `injectFlexRenderContext`), see the [Rendering (Angular) Guide](./guide/rendering.md).

### Context helpers and directives

`@tanstack/angular-table` also exports Angular DI helpers and directives for table/cell/header context:

- `TanStackTable` + `injectTableContext()`
- `TanStackTableCell` + `injectTableCellContext()`
- `TanStackTableHeader` + `injectTableHeaderContext()`

These APIs provide signal-based context values and are available from nearest directives or from `*flexRender`-rendered components when matching props are present.
