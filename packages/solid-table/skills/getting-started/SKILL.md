---
name: getting-started
description: Create and render Table v9 with the solid adapter. Route reusable createTableHook components, Query and Virtual integration, and framework setup; use table-state for reactive ownership.
metadata:
  type: framework
  library: '@tanstack/solid-table'
  library_version: '9.2.8'
  framework: solid
requires:
  - '@tanstack/table-core#core'
sources:
  - TanStack/table:docs/framework/solid/guide/migrating.md
  - TanStack/table:examples/solid/basic-use-table
  - TanStack/table:packages/solid-table/src/index.tsx
  - TanStack/table:docs/framework/solid/guide/composable-tables.md
  - TanStack/table:examples/solid/composable-tables
  - TanStack/table:packages/solid-table/src/createTableHook.tsx
  - TanStack/table:examples/solid/with-tanstack-query
  - TanStack/table:docs/framework/solid/guide/pagination.md
  - TanStack/table:docs/framework/solid/guide/virtualization.md
  - TanStack/table:examples/solid/virtualized-rows
  - TanStack/table:examples/solid/virtualized-columns
  - TanStack/table:examples/solid/virtualized-infinite-scrolling
---

# Solid Table setup and integration

Before starting, run `intent load @tanstack/table-core#core` for the shared headless model and stable-input rules.

## Setup

```tsx
import { For, createSignal } from 'solid-js'
import {
  createColumnHelper,
  createTable,
  tableFeatures,
} from '@tanstack/solid-table'

type Person = { name: string }
const features = tableFeatures({})
const helper = createColumnHelper<typeof features, Person>()
const columns = helper.columns([helper.accessor('name', { header: 'Name' })])

export function PeopleTable() {
  const [data] = createSignal<Person[]>([{ name: 'Ada' }])
  const table = createTable({
    features,
    columns,
    get data() {
      return data()
    },
  })
  return (
    <table>
      <thead>
        <For each={table.getHeaderGroups()}>
          {(group) => (
            <tr>
              <For each={group.headers}>
                {(header) => (
                  <th>
                    <table.FlexRender header={header} />
                  </th>
                )}
              </For>
            </tr>
          )}
        </For>
      </thead>
      <tbody>
        <For each={table.getRowModel().rows}>
          {(row) => (
            <tr>
              <For each={row.getAllCells()}>
                {(cell) => (
                  <td>
                    <table.FlexRender cell={cell} />
                  </td>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  )
}
```

## Essential constraints

Use `createTable` in a Solid owner. Preserve changing data with `get data() { return data() }`; `data: data()` captures a snapshot. Keep features and columns stable and derive transformed arrays with `createMemo`.

Table owns models and state. The application owns markup, CSS, interactions, and accessibility. Core-only tables use `row.getAllCells()`; visibility-aware methods need `columnVisibilityFeature`. Optional state and APIs require their features. Put row-model slots after their prerequisite features in `tableFeatures()`.

## Load by task

- For repeated features, defaults, typed contexts, or component registries, read [reusable app hooks](references/create-table-hook.md).
- For Query-backed data, server pages, sorting, filtering, or request keys, read [TanStack Query integration](references/with-tanstack-query.md).
- For virtual rows, columns, dynamic measurement, or infinite scrolling, read [TanStack Virtual integration](references/with-tanstack-virtual.md).
- For controlled state, tracked reads, or render subscriptions, read [table state](../table-state/SKILL.md).
- For feature registration, missing feature APIs, or processing ownership, run `intent load @tanstack/table-core#table-features` and read only references needed by the task.
- For v8 code, read the [migration checklist](../migrate-v8-to-v9/SKILL.md).

## API discovery

Inspect `node_modules/@tanstack/solid-table/dist/index.d.ts`, then the exported adapter declarations for the installed version. Inspect optional core APIs under `node_modules/@tanstack/table-core/dist/features/`.
