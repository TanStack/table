---
name: getting-started
description:
  Create and render Table v9 with the angular adapter. Route reusable createTableHook
  components, Query and Virtual integration, and framework setup; use table-state for reactive
  ownership.
metadata:
  type: framework
  library: '@tanstack/angular-table'
  framework: angular
  library_version: '9.2.6'
requires:
  - '@tanstack/table-core#core'
sources:
  - TanStack/table:docs/framework/angular/guide/migrating.md
  - TanStack/table:docs/framework/angular/guide/flex-render.md
  - TanStack/table:examples/angular/basic-inject-table
  - TanStack/table:packages/angular-table/src/index.ts
  - TanStack/table:docs/framework/angular/guide/composable-tables.md
  - TanStack/table:examples/angular/composable-tables
  - TanStack/table:packages/angular-table/src/helpers/createTableHook.ts
  - TanStack/table:examples/angular/with-tanstack-query
  - TanStack/table:docs/framework/angular/guide/table-state.md
  - TanStack/table:docs/framework/angular/guide/pagination.md
  - TanStack/table:docs/framework/angular/guide/virtualization.md
  - TanStack/table:examples/angular/virtualized-rows
  - TanStack/table:examples/angular/virtualized-columns
  - TanStack/table:examples/angular/virtualized-infinite-scrolling
---

Load `intent load @tanstack/table-core#core` first for the headless model, stable inputs, and column inference.

## Setup

```ts
import { Component, signal } from '@angular/core'
import { FlexRender, injectTable, tableFeatures } from '@tanstack/angular-table'

type Person = { name: string; age: number }
const features = tableFeatures({})
const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
]

@Component({
  selector: 'app-table',
  imports: [FlexRender],
  template: `<table>
    <tbody>
      @for (row of table.getRowModel().rows; track row.id) {
        <tr>
          @for (cell of row.getAllCells(); track cell.id) {
            <td>
              <ng-container *flexRenderCell="cell; let value">{{
                value
              }}</ng-container>
            </td>
          }
        </tr>
      }
    </tbody>
  </table>`,
})
export class TableComponent {
  readonly data = signal<Person[]>([{ name: 'Ada', age: 36 }])
  readonly table = injectTable(() => ({ features, columns, data: this.data() }))
}
```

## Construction and rendering

Call `injectTable` in a component, directive, or service field initializer, or another valid Angular injection context. The adapter binds its cleanup to that context.

Signals read in the options initializer rerun it and call `setOptions`. Keep features, factories, and columns outside the initializer; return stable data references and derive transformed data with `computed` outside it.

Import `FlexRender` for `*flexRender`, `*flexRenderCell`, `*flexRenderHeader`, and `*flexRenderFooter`. Render values can be primitives, `TemplateRef`, component types, or `flexRenderComponent(...)`. Use `flexRenderComponent` for Angular component types; ordinary render functions are already supported directly.

## Read for the task

- When adding or configuring optional features, load `intent load @tanstack/table-core#table-features` and read only references for the requested behavior.
- For state ownership or reactive reads, read [table-state](../table-state/SKILL.md).
- When tables share features, defaults, or reusable UI, read [create-table-hook](references/create-table-hook.md).
- When Query supplies data or server processing, read [with-tanstack-query](references/with-tanstack-query.md).
- When virtualizing rows or columns, read [with-tanstack-virtual](references/with-tanstack-virtual.md).
- When upgrading v8 code, read [migrate-v8-to-v9](../migrate-v8-to-v9/SKILL.md).

## API discovery

Inspect `node_modules/@tanstack/angular-table/dist/types/` for the bundled public declarations. Inspect feature APIs under `node_modules/@tanstack/table-core/dist/features/`.
