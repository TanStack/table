# Angular reusable table hooks

Read when multiple Angular tables share features, defaults, or rendering conventions. Keep standalone construction for tables without shared conventions. For controlled state or reactive reads, read [table-state](../../table-state/SKILL.md).

This reference inherits the version of its owning skill.

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

## Core patterns

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

## Common mistakes

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

Registered components can consume the app hook's typed cell context directly.

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

## API discovery

Inspect `node_modules/@tanstack/angular-table/dist/types/` for exact DI and rendering contracts in the bundled public API.

## Sources

- `TanStack/table:docs/framework/angular/guide/composable-tables.md`
- `TanStack/table:examples/angular/composable-tables`
- `TanStack/table:packages/angular-table/src/helpers/createTableHook.ts`
