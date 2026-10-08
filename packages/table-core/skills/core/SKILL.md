---
name: core
description:
  Use TanStack Table v9 core architecture, stable data and columns, and inferred
  types. Route setup, missing APIs, row models, state, features, and framework-specific work.
metadata:
  type: core
  library: '@tanstack/table-core'
  library_version: '9.2.8'
sources:
  - TanStack/table:docs/overview.md
  - TanStack/table:docs/guide/tables.md
  - TanStack/table:docs/guide/data.md
  - TanStack/table:packages/table-core/src/index.ts
  - TanStack/table:docs/guide/helpers.md
  - TanStack/table:docs/guide/column-defs.md
  - TanStack/table:docs/guide/table-and-column-meta.md
  - TanStack/table:packages/table-core/src/helpers
  - TanStack/table:packages/table-core/src/types/TableFeatures.ts
  - TanStack/table:docs/framework/react/guide/migrating.md
  - TanStack/table:docs/guide/rows.md
  - TanStack/table:packages/table-core/src/core/rows/coreRowsFeature.utils.ts
---

# TanStack Table core

TanStack Table coordinates state and row processing. The renderer owns markup, styles, semantics, and interaction accessibility. Use the installed framework adapter in UI code; use `constructTable` for framework-neutral integrations.

## Minimal setup

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

## Essential constraints

- The core row model is automatic. Optional APIs and state exist only after their feature is registered.
- Keep `features`, `data`, and `columns` stable between meaningful changes. Derive changing arrays with the adapter's memo/computed mechanism; an inline `.map()`, `.filter()`, column factory, or fresh `[]` fallback invalidates model work and can cause render loops.
- Let `createColumnHelper` and `helper.columns()` preserve accessor value types. Derive feature types from the concrete registry when an explicit boundary is needed.
- Call row, cell, column, and header methods on their instance. Use `row.getValue('name')` or a callback that calls it; extracting `const { getValue } = row` loses its `this` receiver.
- Render the final `table.getRowModel().rows`. The table object itself is not a DOM component.

## Read for the current task

| Task                                                                | Read                                                                                    |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Add or repair optional features, processing slots, or prerequisites | [Feature architecture](../table-features/SKILL.md), then its relevant feature reference |
| Choose state ownership, initialize or reset state                   | [Shared state](../table-state/SKILL.md)                                                 |
| Fix `ColumnDef` inference, reusable options, or scoped meta         | [TypeScript inference](references/typescript.md)                                        |
| Diagnose a missing export, option, state slice, or instance method  | [API discovery](references/api-not-found.md)                                            |
| Implement row numbers, identity, or display-index behavior          | [Rows](references/rows.md)                                                              |
| Author behavior beyond built-ins or typed meta                      | [Custom features](../custom-features/SKILL.md)                                          |
| Migrate an existing v8 table                                        | [Migration audit](../migrate-v8-to-v9/SKILL.md)                                         |

For framework construction and rendering, load the installed package's `getting-started` skill with `intent load <package>#getting-started`, replacing `<package>` with the actual adapter package, such as `@tanstack/react-table`. For reactive reads or controlled wiring, load that package's `table-state` skill directly.

## Installed API discovery

Start at `node_modules/@tanstack/table-core/dist/index.d.ts` and follow exported declarations. Adapter declaration layouts and missing-API diagnosis are in [API discovery](references/api-not-found.md); read it when the expected export or declaration path is absent.
