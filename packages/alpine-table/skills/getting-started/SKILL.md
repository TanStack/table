---
name: getting-started
description:
  Create and render Table v9 with the alpine adapter. Route reusable createTableHook
  defaults, and framework setup; use table-state for reactive ownership.
metadata:
  type: framework
  library: '@tanstack/alpine-table'
  framework: alpine
  library_version: '9.2.8'
requires:
  - '@tanstack/table-core#core'
sources:
  - TanStack/table:docs/framework/alpine/guide/table-state.md
  - TanStack/table:examples/alpine/basic-create-table
  - TanStack/table:packages/alpine-table/src/index.ts
  - TanStack/table:docs/framework/alpine/guide/composable-tables.md
  - TanStack/table:examples/alpine/basic-app-table
  - TanStack/table:packages/alpine-table/src/createTableHook.ts
---

Load `intent load @tanstack/table-core#core` first for the headless model, stable inputs, and column inference.

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

## Construction and rendering

Wrap changing data in `Alpine.reactive` and expose it with `get data()`. The adapter tracks option getters; `data: local.data` captures a snapshot and does not follow later array replacements. Keep static columns and features outside getters.

The returned table is a reactive proxy. Read Table APIs directly in `x-text`, `x-for`, `x-if`, or bound attributes; no Subscribe component is needed.

Build table structure and interactive controls as real Alpine markup. Use `x-html="FlexRender({ header })"` or `x-html="FlexRender({ cell })"` for renderer output. Alpine does not initialize directives inside `x-html` strings; use templates or `Alpine.bind` bundles for buttons and inputs.

## Read for the task

- When adding or configuring optional features, load `intent load @tanstack/table-core#table-features` and read only references for the requested behavior.
- For state ownership or reactive reads, read [table-state](../table-state/SKILL.md).
- When tables share features, defaults, or reusable UI, read [create-table-hook](references/create-table-hook.md).

## API discovery

Inspect `node_modules/@tanstack/alpine-table/dist/index.d.ts`, `createTable.d.ts`, and `reactivity.d.ts`. Core feature APIs are in `node_modules/@tanstack/table-core/dist/features/`.
