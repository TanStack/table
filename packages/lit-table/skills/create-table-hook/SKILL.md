---
name: create-table-hook
description: >
  Create a reusable Lit useAppTable/createAppColumnHelper layer with host-backed controllers, shared features/defaults, typed cell/header renderers, App wrappers, and useTableContext for custom-element controls. Load when multiple Lit tables share infrastructure or prop drilling obscures table context.
metadata:
  type: framework
  library: '@tanstack/lit-table'
  framework: lit
  library_version: '9.0.0-beta.38'
requires:
  - '@tanstack/table-core#core'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:docs/framework/lit/guide/composable-tables.md'
  - 'TanStack/table:examples/lit/composable-tables'
  - 'TanStack/table:packages/lit-table/src/createTableHook.ts'
---

This skill builds on @tanstack/table-core#core plus this package's getting-started and table-state skills.

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

## Core Patterns

### Bind shared features, not table-specific data

Put feature plugins, row-model factories, default options, row IDs, and shared render conventions in the factory. Pass each table's columns, data, and controlled state to `useAppTable`.

### Add component registries only for real conventions

Register common cell/header functions when multiple tables use them. Render them through `table.AppCell` and `table.AppHeader`; ordinary tables can use the returned table instance without registries.

### Consume table context in custom elements

Table-level controls can call the returned `useTableContext(this)` from a custom element. This preserves the factory's feature and data types without prop drilling.

## Common Mistakes

### MEDIUM Factory used for one table

Wrong: add an app hook and registries for a single isolated table.

Correct: use `TableController` directly until features, defaults, or UI conventions genuinely repeat.

The factory adds an application abstraction; it does not replace the simpler standalone path.

Source: TanStack/table:docs/framework/lit/guide/composable-tables.md

### HIGH Prop drilling replaces typed context

Wrong: pass the stable table instance through every custom-element property boundary.

Correct: call the `useTableContext` returned by the same `createTableHook` in the nearest registered/custom control.

The returned context is bound to the factory's exact features and components.

Source: TanStack/table:packages/lit-table/src/createTableHook.ts

### HIGH Recreating useAppTable each render

Wrong: call `useAppTable(this, options)` afresh inside `render`.

Correct: initialize it once as a host field and call `this.appTable.table()` during render.

The helper owns a TableController and context provider tied to the host lifecycle.

Source: TanStack/table:examples/lit/composable-tables

## API Discovery

Inspect `node_modules/@tanstack/lit-table/src/createTableHook.ts`. Use the matching installed implementation rather than assuming JSX-adapter component APIs exist in Lit.
