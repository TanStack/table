---
name: getting-started
description: >
  Create an Alpine TanStack Table v9 table with createTable, explicit tableFeatures, Alpine.reactive data getters, x-for rendering, and FlexRender through x-html. Load for first-table setup, reactive options, or when nested Alpine directives rendered by x-html do not initialize.
metadata:
  type: framework
  library: '@tanstack/alpine-table'
  framework: alpine
  library_version: '9.0.0-beta.55'
requires:
  - '@tanstack/table-core#core'
  - '@tanstack/table-core#table-features'
sources:
  - 'TanStack/table:docs/framework/alpine/guide/table-state.md'
  - 'TanStack/table:examples/alpine/basic-create-table'
  - 'TanStack/table:packages/alpine-table/src/index.ts'
---

This skill builds on @tanstack/table-core#core and @tanstack/table-core#table-features.

## Setup

```ts
import Alpine from 'alpinejs'
import {
  FlexRender,
  createTable,
  tableFeatures,
  type ColumnDef,
} from '@tanstack/alpine-table'

type Person = { id: string; name: string }
const features = tableFeatures({})
const columns: Array<ColumnDef<typeof features, Person>> = [
  { accessorKey: 'name', header: 'Name' },
]

Alpine.data('peopleTable', () => {
  const local = Alpine.reactive({
    data: [{ id: '1', name: 'Ada' }] as Array<Person>,
  })
  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
    getRowId: (row) => row.id,
  })

  return { table, FlexRender }
})

window.Alpine = Alpine
Alpine.start()
```

Render real table structure with `x-for`; use `x-html="FlexRender({ header })"` or `x-html="FlexRender({ cell })"` only for renderer output.

## Core Patterns

### Pass live options through getters

Wrap changing data in an `Alpine.reactive({ data })` object and read `local.data` through `get data()`. The property read gives the adapter's effect a dependency to track before it calls `table.setOptions`.

### Read table APIs directly in bindings

The adapter returns a reactive proxy. Expressions such as `x-text="table.getRowModel().rows.length"` update without a Subscribe component.

### Render interaction controls as real markup

Buttons, inputs, and directives belong in the template. Renderer strings are useful for cell content, but `x-html` does not initialize Alpine directives inside the injected HTML.

## Common Mistakes

### HIGH Passing a data snapshot

Wrong: `createTable({ features, columns, data: local.data })` when `local.data` will be replaced.

Correct: expose `get data() { return local.data }`.

The adapter tracks option getters; a captured array does not follow later replacements.

Source: TanStack/table:packages/alpine-table/src/createTable.ts

### HIGH Interactive directives hidden in x-html

Wrong: return `'<button @click="remove()">Remove</button>'` from a cell renderer.

Correct: render the button as real template markup and bind the row action there, or use an `Alpine.bind` bundle.

Alpine does not initialize directives inside content inserted by `x-html`.

Source: TanStack/table:docs/framework/alpine/guide/composable-tables.md

### HIGH Expecting Table styling

Wrong: enable sizing or pinning and assume widths/sticky positioning appear.

Correct: apply widths, logical offsets, overflow, and sticky CSS in the Alpine template.

Table exposes state and geometry; it does not own the renderer.

Source: TanStack/table:docs/overview.md

## API Discovery

Inspect `node_modules/@tanstack/alpine-table/dist/index.d.ts` and `createTable.d.ts`. Exact core APIs live under `node_modules/@tanstack/table-core/dist/`.
