---
name: core
description: >
  Use TanStack Table v9 as a headless data-grid state and row-processing engine. Load for first-table architecture, stable data and columns, row numbering with getDisplayIndex, semantic rendering, framework adapter choice, or deciding what Table owns versus the renderer.
metadata:
  type: core
  library: '@tanstack/table-core'
  library_version: '9.2.3'
sources:
  - 'TanStack/table:docs/overview.md'
  - 'TanStack/table:docs/guide/tables.md'
  - 'TanStack/table:docs/guide/data.md'
  - 'TanStack/table:docs/guide/rows.md'
  - 'TanStack/table:packages/table-core/src/index.ts'
---

# TanStack Table Core

TanStack Table creates a table instance, state, and row models. It does not render a component, choose a component library, apply CSS, or supply interaction accessibility. Use a framework adapter in UI code; use `constructTable` only for framework-neutral integrations.

## Setup

<!-- skill-snippet:check -->

```ts
import {
  constructTable,
  createColumnHelper,
  tableFeatures,
} from '@tanstack/table-core'
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'

type Person = { id: string; name: string }
const features = tableFeatures({
  coreReactivityFeature: storeReactivityBindings(),
})
const helper = createColumnHelper<typeof features, Person>()
const columns = helper.columns([helper.accessor('name', { header: 'Name' })])
const data: Person[] = [{ id: '1', name: 'Ada' }]
const table = constructTable({
  features,
  columns,
  data,
  getRowId: (row) => row.id,
})

for (const row of table.getRowModel().rows) {
  console.log(row.getAllCells().map((cell) => cell.getValue()))
}
```

## Core Patterns

### Start with core, add only behavior used

```ts
const features = tableFeatures({
  coreReactivityFeature: storeReactivityBindings(),
})
```

The core row model is automatic; filtering, sorting, pagination, and other optional behavior require their feature plugins.

### Keep model inputs stable

```ts
const data: Person[] = [{ id: '1', name: 'Ada' }]
const columns = helper.columns([helper.accessor('name', { header: 'Name' })])
```

Define static inputs once and preserve query/store references when data has not changed.

### Number rows in current display order

```ts
const rowNumberColumn = helper.display({
  id: 'rowNumber',
  header: '#',
  cell: ({ row }) => {
    const displayIndex = row.getDisplayIndex()
    return displayIndex === -1 ? '' : displayIndex + 1
  },
})
```

`row.getDisplayIndex()` follows the current filtering, grouping, sorting, and expansion order before pagination. `row.index` remains the row's creation-time position within its parent array.

## Common Mistakes

### [HIGH] Expecting Table to render a grid

Wrong:

```ts
document.body.append(table as unknown as Node)
```

Correct:

```ts
const names = table
  .getRowModel()
  .rows.map((row) => row.getValue<string>('name'))
document.body.textContent = names.join(', ')
```

The table instance is a model; markup, CSS, semantics, and accessibility are renderer responsibilities.

Source: `docs/overview.md`

### [HIGH] Recreating model inputs repeatedly

Wrong:

```ts
const options = () => ({
  data: source.map((item) => item),
  columns: helper.columns([]),
})
```

Correct:

```ts
const data = source.map((item) => item)
const columns = helper.columns([])
const options = () => ({ data, columns })
```

New references invalidate memoized row and column work and can create adapter render loops.

Source: `docs/guide/data.md`

### [HIGH] Detaching prototype-bound methods

Wrong:

```ts
const { getValue } = table.getRowModel().rows[0]!
getValue('name')
```

Correct:

```ts
const row = table.getRowModel().rows[0]!
row.getValue('name')
```

V9 row, cell, column, and header methods use their instance as `this`.

Source: `docs/framework/react/guide/migrating.md#instance-methods-must-be-called-on-their-instance`

### [HIGH] Reading the display-index cache directly

Wrong:

```ts
const rowNumber = row._displayIndexCache + 1
```

Correct:

```ts
const displayIndex = row.getDisplayIndex()
const rowNumber = displayIndex === -1 ? undefined : displayIndex + 1
```

`_displayIndexCache` is internal and may be stale until display order is recomputed. The public method refreshes display order, validates that the cached slot still contains the row, and returns `-1` when it does not.

Source: `docs/guide/rows.md#row-numbers-and-display-indexes`, `packages/table-core/src/core/rows/coreRowsFeature.utils.ts`

## API Discovery

Inspect `node_modules/@tanstack/table-core/dist/index.d.ts`, then follow the exported implementation. For UI creation and rendering, inspect `node_modules/@tanstack/<framework>-table/dist/index.d.ts` and load that adapter's getting-started skill.
