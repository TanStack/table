---
name: getting-started
description: Create and render Table v9 with the react adapter. Route reusable createTableHook components, Query and Virtual integration, and framework setup; use table-state for reactive ownership.
metadata:
  type: framework
  library: '@tanstack/react-table'
  library_version: 9.2.5
  framework: react
requires:
  - '@tanstack/table-core#core'
sources:
  - TanStack/table:docs/framework/react/guide/migrating.md
  - TanStack/table:examples/react/basic-use-table
  - TanStack/table:packages/react-table/src/index.ts
  - TanStack/table:docs/framework/react/guide/composable-tables.md
  - TanStack/table:docs/framework/react/guide/table-context.md
  - TanStack/table:examples/react/composable-tables
  - TanStack/table:packages/react-table/src/createTableHook.tsx
  - TanStack/table:packages/react-table/src/createTableHookContexts.tsx
  - TanStack/table:examples/react/with-tanstack-query
  - TanStack/table:examples/react/virtualized-infinite-scrolling
  - TanStack/table:docs/framework/react/guide/pagination.md
  - TanStack/table:docs/framework/react/guide/virtualization.md
  - TanStack/table:examples/react/virtualized-rows
  - TanStack/table:examples/react/virtualized-columns
---

# React Table setup and integration

Before starting, run `intent load @tanstack/table-core#core` for the shared headless model and stable-input rules.

## Setup

```tsx
import { useState } from 'react'
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'

type Person = { name: string; age: number }
const features = tableFeatures({})
const helper = createColumnHelper<typeof features, Person>()
const columns = helper.columns([
  helper.accessor('name', { header: 'Name' }),
  helper.accessor('age', { header: 'Age' }),
])

export function PeopleTable() {
  const [data] = useState<Person[]>([{ name: 'Ada', age: 36 }])
  const table = useTable({ features, columns, data })

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((group) => (
          <tr key={group.id}>
            {group.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder ? null : (
                  <table.FlexRender header={header} />
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getAllCells().map((cell) => (
              <td key={cell.id}>
                <table.FlexRender cell={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

Table produces models and state; React owns the semantic markup, styles, event affordances, and accessibility.

## Essential constraints

Use `useTable` for v9. Keep `features`, `columns`, and fallback data at module scope or in stable state/memos. A new `response.data ?? []` fallback invalidates row models on every render. The default selector subscribes the owner to all registered state.

Table owns models and state. The application owns markup, CSS, interactions, and accessibility. Core-only tables use `row.getAllCells()`; visibility-aware methods need `columnVisibilityFeature`. Optional state and APIs require their features. Put row-model slots after their prerequisite features in `tableFeatures()`.

## Load by task

- For repeated features, defaults, typed contexts, or component registries, read [reusable app hooks](references/create-table-hook.md).
- For Query-backed data, server pages, sorting, filtering, or request keys, read [TanStack Query integration](references/with-tanstack-query.md).
- For virtual rows, columns, dynamic measurement, or infinite scrolling, read [TanStack Virtual integration](references/with-tanstack-virtual.md).
- For controlled state, tracked reads, or render subscriptions, read [table state](../table-state/SKILL.md).
- For feature registration, missing feature APIs, or processing ownership, run `intent load @tanstack/table-core#table-features` and read only references needed by the task.
- For v8 code, read the [migration checklist](../migrate-v8-to-v9/SKILL.md).

## API discovery

Inspect `node_modules/@tanstack/react-table/dist/index.d.ts`, then the exported adapter declarations for the installed version. Inspect optional core APIs under `node_modules/@tanstack/table-core/dist/features/`.
