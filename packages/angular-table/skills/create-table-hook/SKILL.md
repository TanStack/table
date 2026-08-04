---
name: create-table-hook
description: >
  Create an Angular injectAppTable/createAppColumnHelper abstraction with shared features/defaults, registered components, injectTableContext/injectTableCellContext/injectTableHeaderContext, and correct FlexRender component-versus-function handling.
metadata:
  type: framework
  library: '@tanstack/angular-table'
  framework: angular
  library_version: '9.0.0-beta.80'
requires:
  - '@tanstack/table-core#core'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:docs/framework/angular/guide/composable-tables.md'
  - 'TanStack/table:examples/angular/composable-tables'
  - 'TanStack/table:packages/angular-table/src/helpers/createTableHook.ts'
---

This skill builds on `@tanstack/table-core#core`, `getting-started`, and `table-state`. Use it for repeated app conventions; keep one-off tables on `injectTable`.

## Setup

```ts
import {
  createTableHook,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/angular-table'

export const {
  injectAppTable,
  createAppColumnHelper,
  injectTableContext,
  injectTableCellContext,
  injectTableHeaderContext,
} = createTableHook({
  features: tableFeatures({ rowSortingFeature }),
})
```

```ts
const helper = createAppColumnHelper<Person>()
const columns = helper.columns([helper.accessor('name', { header: 'Name' })])

export class PeopleTable {
  readonly table = injectAppTable(() => ({ columns, data: this.data() }))
}
```

## Core Patterns

### Consume typed DI context in registered components

```ts
export class NameCell {
  readonly cell = injectTableCellContext<string, Person>()
  readonly value = computed(() => this.cell().getValue())
}
```

Use the matching table/header/cell injector instead of threading context props through reusable components.

### Distinguish component types from render functions

Register either an Angular component type or a render function. Return component types directly when FlexRender should set context inputs; use `flexRenderComponent(Component, options)` only for explicit inputs/outputs/injector/bindings/directives.

## Common Mistakes

### CRITICAL Calling app helpers outside DI

Wrong:

```ts
export function make() {
  return injectAppTable(() => options)
}
```

Correct:

```ts
export class PeopleTable {
  readonly table = injectAppTable(() => options())
}
```

Both app-table construction and returned context injectors require Angular injection context.

Source: `packages/angular-table/src/helpers/createTableHook.ts`

### HIGH Prop drilling registered context

Wrong:

```ts
cell: (ctx) => flexRenderComponent(NameCell, { inputs: { cell: ctx.cell } })
```

Correct:

```ts
cell: (ctx) => ctx.cell.NameCell
```

Registered components can consume the app hook’s typed cell context directly.

Source: `docs/framework/angular/guide/composable-tables.md`

### HIGH Wrapping a function as a component

Wrong:

```ts
flexRenderComponent((props) => props.cell.getValue())
```

Correct:

```ts
;(props) => props.cell.getValue()
```

`flexRenderComponent` validates an Angular component type; plain render functions are already valid render content.

Source: `packages/angular-table/src/flex-render/flexRenderComponent.ts`

### MEDIUM Abstracting a one-off table

Wrong:

```ts
const hook = createTableHook({ features: tableFeatures({}) })
```

Correct:

```ts
readonly table = injectTable(() => ({ features, columns, data: this.data() }))
```

Use the app hook only when shared defaults, types, or registered components justify it.

Source: `docs/framework/angular/guide/composable-tables.md`

## API Discovery

Inspect `node_modules/@tanstack/angular-table/dist/types/` for exact DI and rendering contracts in the bundled public API.
