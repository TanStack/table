---
name: getting-started
description: >
  Create an Angular TanStack Table v9 table with injectTable inside injection context, explicit stable tableFeatures and columns, signal-backed data, and FlexRender structural directives or helpers.
metadata:
  type: framework
  library: '@tanstack/angular-table'
  framework: angular
  library_version: '9.0.0-beta.70'
requires:
  - '@tanstack/table-core#core'
  - '@tanstack/table-core#table-features'
sources:
  - 'TanStack/table:docs/framework/angular/guide/migrating.md'
  - 'TanStack/table:docs/framework/angular/guide/rendering.md'
  - 'TanStack/table:examples/angular/basic-inject-table'
  - 'TanStack/table:packages/angular-table/src/index.ts'
---

This skill builds on `@tanstack/table-core#core` and `@tanstack/table-core#table-features`. Read them first for the headless model and explicit features.

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

## Core Patterns

### Keep static inputs outside the initializer

`injectTable` reruns its options initializer when a signal read changes. Define features, row-model factories, and columns at module or stable class scope; read only changing values inside.

### Render each content kind correctly

Import `FlexRender` for `*flexRender`, `*flexRenderCell`, `*flexRenderHeader`, and `*flexRenderFooter`. Definitions may yield primitives, `TemplateRef`, component types, or `flexRenderComponent(...)`; Table does not supply markup or CSS.

## Common Mistakes

### CRITICAL Calling injectTable outside DI

Wrong:

```ts
export function makeTable() {
  return injectTable(() => ({ features, columns, data }))
}
```

Correct:

```ts
export class TableComponent {
  readonly table = injectTable(() => ({ features, columns, data: this.data() }))
}
```

`injectTable` asserts an Angular injection context and registers lifecycle cleanup there.

Source: `packages/angular-table/src/injectTable.ts`

### HIGH Reallocating static options reactively

Wrong:

```ts
injectTable(() => ({
  features: tableFeatures({}),
  columns: makeColumns(),
  data: this.data(),
}))
```

Correct:

```ts
const features = tableFeatures({})
const columns = makeColumns()
injectTable(() => ({ features, columns, data: this.data() }))
```

Every signal change reruns the initializer; rebuilding static inputs invalidates memoized Table work.

Source: `packages/angular-table/src/injectTable.ts`

### HIGH Treating a render function as a component

Wrong:

```ts
cell: () => flexRenderComponent(() => 'value')
```

Correct:

```ts
cell: () => 'value'
```

`flexRenderComponent` wraps an Angular component type; ordinary functions and primitives are handled directly by FlexRender.

Source: `docs/framework/angular/guide/rendering.md`

## API Discovery

Inspect `node_modules/@tanstack/angular-table/dist/types/` for the bundled public API; inspect optional feature APIs in installed `@tanstack/table-core/dist/features/`.
