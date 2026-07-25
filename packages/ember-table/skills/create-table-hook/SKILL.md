---
name: create-table-hook
description: >
  Share TanStack Ember Table v9 features, row-model slots, defaults, and inferred column helpers with createTableHook, createAppTable, createAppColumnHelper, and appFeatures. Load for recurring Ember table conventions, per-table overrides, or confusion with component/context registries from other adapters.
metadata:
  type: framework
  library: '@tanstack/ember-table'
  framework: ember
  library_version: '9.0.0-beta.57'
requires:
  - '@tanstack/table-core#core'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:docs/framework/ember/guide/composable-tables.md'
  - 'TanStack/table:examples/ember/basic-app-table'
  - 'TanStack/table:packages/ember-table/src/create-table-hook.ts'
---

This skill builds on `@tanstack/table-core#core`, `getting-started`, and `table-state`. Use an app factory when several tables share real features or defaults; keep a one-off table on `useTable`.

## Setup

```gts
import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import {
  createSortedRowModel,
  createTableHook,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
} from '@tanstack/ember-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
})

export const { appFeatures, createAppColumnHelper, createAppTable } =
  createTableHook({
    features,
    enableSortingRemoval: false,
  })

type Person = { id: string; name: string }
const columnHelper = createAppColumnHelper<Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('name', { header: 'Name' }),
])

export default class PeopleTable extends Component {
  @tracked data: Person[] = []

  table = createAppTable(() => ({
    columns,
    data: this.data,
  }))
}
```

Create the hook and column helpers at stable module scope. `createAppTable` preserves the `useTable` options thunk, so tracked reads such as `this.data` remain reactive. Do not pass `features` again at the table call site; the factory owns the feature set and binds it into column inference.

## Composition Contract

- Hook options supply stable shared `features` and default table options.
- `createAppColumnHelper<TData>()` binds the feature type while inferring each row type.
- `createAppTable(() => options)` merges shared defaults with table-specific options.
- Table-specific options win over shared defaults, except that the factory remains the feature owner.
- `appFeatures` exposes the exact registered feature set for helper types or reusable utilities.

Shared options intentionally exclude `columns`, `data`, and `state`. Keep model inputs and controlled state at each table call site; share conventions, not one mutable state object across unrelated tables.

Sharing `rowSortingFeature`, `sortedRowModel`, and sorting defaults gives every table sorting capability; it does not make their internal sorting state shared. The factory technically accepts a stable external atom in shared `atoms`, but that deliberately couples tables and their column IDs. Prefer independent state unless synchronized tables are the actual product behavior.

## Render Normally

Ember's factory does not register `AppTable`, `AppCell`, `AppHeader`, context hooks, or reusable component registries. Continue rendering with `FlexRenderCell`, `FlexRenderHeader`, and `FlexRenderFooter`. Continue wrapping receiver-dependent v9 methods in Ember template helpers as described by `getting-started`.

## Common Mistakes

### HIGH Copying another adapter's component registry

Wrong: expect `table.AppTable`, `useTableContext`, or a `tableComponents` option from React, Solid, Svelte, or Lit examples.

Correct: use the normal Ember FlexRender components and pass the table through ordinary Ember composition when another component truly needs it.

The Ember hook shares features/defaults and type inference only.

### HIGH Passing features per table

Wrong:

```gts
createAppTable(() => ({ features: otherFeatures, columns, data: this.data }))
```

Correct: define a separate app hook when a table needs a genuinely different feature set. `createAppTable` omits `features` from its call-site type.

### HIGH Recreating the hook or columns with tracked updates

Wrong: call `createTableHook`, `createAppColumnHelper`, or `columns(...)` inside a component getter or the `createAppTable` thunk.

Correct: create them once at module scope and let the table thunk read only changing inputs.

### MEDIUM Sharing controlled state as a default

The hook options omit `state`. Put `state` and matching `on[State]Change` callbacks in each `createAppTable` thunk so every table has one clear owner per slice. Use a shared external atom only when tables intentionally coordinate the same compatible slice.

### MEDIUM Repeating manual feature generics

Use `createAppColumnHelper<Person>()`; do not thread `typeof features` through every column helper after the factory has already captured it.

## API Discovery

Inspect `node_modules/@tanstack/ember-table/declarations/create-table-hook.d.ts` for the installed factory return shape, omitted options, and merge precedence. Inspect `use-table.d.ts` for thunk reactivity and `node_modules/@tanstack/table-core/dist/features/<feature>/` for the shared feature APIs. Do not infer Ember component/context behavior from another adapter's createTableHook.
