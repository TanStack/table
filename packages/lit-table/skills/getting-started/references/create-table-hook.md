# Lit reusable table hooks

Read when multiple Lit tables share features, defaults, or rendering conventions. Keep standalone construction for tables without shared conventions. For controlled state or reactive reads, read [table-state](../../table-state/SKILL.md).

This reference inherits the version of its owning skill.

## Setup

```ts
import {
  createSortedRowModel,
  createTableHook,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/lit-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})

export const { createAppColumnHelper, useAppTable, useTableContext } =
  createTableHook({
    features,
    getRowId: (row: { id: string }) => row.id,
  })
```

Use `createAppColumnHelper<Person>()` to define app columns. In a `LitElement`, capture the host in a local variable and initialize `useAppTable(host, options, selector)` once as a field; call the returned `table()` function during render. The maintained composable-tables example shows the complete host/getter shape.

## Core patterns

### Bind shared features, not table-specific data

Put feature plugins, row-model factories, default options, row IDs, and shared render conventions in the factory. Pass each table's columns, data, and controlled state to `useAppTable`.

### Add component registries only for real conventions

Register common cell/header functions when multiple tables use them. Render them through `table.AppCell` and `table.AppHeader`; ordinary tables can use the returned table instance without registries.

### Consume table context in custom elements

Create the returned `useTableContext(this)` once as a custom-element field. Read its `.value` during render and handle `undefined` before the provider is available. The value is a base `LitTable` with the factory's feature types, not the extended table with registered components or `App*` helpers.

## Common mistakes

### HIGH Prop drilling replaces typed context

Wrong: pass the stable table instance through every custom-element property boundary.

Correct: call the `useTableContext` returned by the same `createTableHook` in the nearest registered/custom control.

Use the context from the same factory so its feature types and provider match. Registered render functions receive their enhanced cell/header values through `AppCell` and `AppHeader`.

Source: TanStack/table:packages/lit-table/src/createTableHook.ts

### HIGH Recreating useAppTable each render

Wrong: call `useAppTable(this, options)` afresh inside `render`.

Correct: initialize it once as a host field and call `this.appTable.table()` during render.

The helper owns a TableController and context provider tied to the host lifecycle.

Source: TanStack/table:examples/lit/composable-tables

## API discovery

Inspect `node_modules/@tanstack/lit-table/dist/createTableHook.d.ts`. Use the matching installed implementation rather than assuming JSX-adapter component APIs exist in Lit.

## Sources

- `TanStack/table:docs/framework/lit/guide/composable-tables.md`
- `TanStack/table:examples/lit/composable-tables`
- `TanStack/table:packages/lit-table/src/createTableHook.ts`
