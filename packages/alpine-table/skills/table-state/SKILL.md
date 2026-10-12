---
name: table-state
description:
  Read and control Table v9 state in alpine. Use for tracked reads, subscriptions,
  controlled slices, and framework-specific reactive boundaries.
metadata:
  type: framework
  library: '@tanstack/alpine-table'
  framework: alpine
  library_version: '9.2.8'
requires:
  - '@tanstack/table-core#table-state'
sources:
  - TanStack/table:docs/framework/alpine/guide/table-state.md
  - TanStack/table:examples/alpine/basic-create-table
  - TanStack/table:packages/alpine-table/src/createTable.ts
---

Load `intent load @tanstack/table-core#table-state` first for shared ownership, initialization, updater, and reset rules.

Alpine's table proxy makes reads inside `x-text`, `x-for`, `x-if`, bound attributes, `x-effect`, and Alpine getters reactive. Event handlers read the current value when invoked. A captured value outside a binding does not become a continuing subscription, and there is no `table.Subscribe` component.

## Controlled getter setup

<!-- skill-snippet:check -->

```ts
import Alpine from 'alpinejs'
import {
  createTable,
  rowPaginationFeature,
  tableFeatures,
  type PaginationState,
} from '@tanstack/alpine-table'

const features = tableFeatures({ rowPaginationFeature })
const columns = [{ accessorKey: 'name' }]
const data = [{ name: 'Ada' }]

Alpine.data('pagedTable', () => {
  const local = Alpine.reactive<{ pagination: PaginationState }>({
    pagination: { pageIndex: 0, pageSize: 10 },
  })
  const table = createTable({
    features,
    columns,
    data,
    state: {
      get pagination() {
        return local.pagination
      },
    },
    onPaginationChange: (next) => {
      local.pagination =
        typeof next === 'function' ? next(local.pagination) : next
    },
  })
  return { table }
})
```

Read `table.atoms.pagination.get().pageIndex` directly in an Alpine binding.

## Reactive boundaries

- A controlled slice needs a getter and callback. `state: { pagination: local.pagination }` captures the old object when the owner later replaces it.
- Expose changing data through `get data()` and keep features, columns, and derived data stable outside reevaluated getters.
- The proxy normally reevaluates all Table-reading bindings for every state change. A narrow atom read does not by itself narrow that broad invalidation.
- For shared state, pass a stable external atom through `atoms`; omit controlled state and its callback for the same slice.

## Read for the task

For advanced reactive boundaries, shared atoms, or detailed subscription examples, read [reactivity](references/reactivity.md). For construction or rendering setup, read [getting-started](../getting-started/SKILL.md).

## API discovery

Inspect `node_modules/@tanstack/alpine-table/dist/index.d.ts`, `createTable.d.ts`, and `reactivity.d.ts`. Core feature APIs are in `node_modules/@tanstack/table-core/dist/features/`.
