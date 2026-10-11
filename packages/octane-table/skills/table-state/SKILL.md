---
name: table-state
description:
  Read and control Table v9 state in octane. Use for tracked reads, subscriptions,
  controlled slices, and framework-specific reactive boundaries.
metadata:
  type: framework
  library: '@tanstack/octane-table'
  framework: octane
  library_version: '9.3.0'
requires:
  - '@tanstack/table-core#table-state'
sources:
  - TanStack/table:docs/framework/octane/guide/table-state.md
  - TanStack/table:examples/octane/basic-subscribe
  - TanStack/table:examples/octane/basic-external-atoms
  - TanStack/table:packages/octane-table/src/useTable.tsrx
  - TanStack/table:packages/octane-table/src/Subscribe.tsrx
---

Load `intent load @tanstack/table-core#table-state` first for shared ownership, initialization, updater, and reset rules.

`useTable` selects all registered state by default. Its second argument changes the selected shape exposed as `table.state` and shallow-gates owner rerenders. Atom `.get()` and `table.store.state` reads are snapshots; use selected state or a rendered `table.Subscribe` to update the UI.

## Controlled slice setup

```tsrx
import { useState } from 'octane'
import {
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/octane-table'

const features = tableFeatures({ rowPaginationFeature })
const columns = [{ accessorKey: 'name' }]
const data = [{ name: 'Ada' }]

function PageStatus() @{
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })
  const table = useTable({
    features,
    columns,
    data,
    state: { pagination },
    onPaginationChange: setPagination,
  })

  <button onClick={() => table.nextPage()}>
    Page {String(table.state.pagination.pageIndex + 1)}
  </button>
}
```

## Reactive boundaries

- Pass both the controlled value and its callback. Octane setters accept Table's value-or-updater callbacks; a callback alone cannot feed the new value back.
- Render `<table.Subscribe>` as a component. Calling it as a normal function shares the owner's compiler slots instead of creating an independent hook scope.
- `useTable` stages fresh options for same-render reads. Controlled state reaches the store only from an accepted layout commit, so abandoned work cannot publish speculative values.
- A stable atom from `@tanstack/octane-store` is a direct synchronous owner. Table writes reach it immediately; it takes precedence over controlled `state` for the same slice.
- Keep features, columns, and data stable. Use the default selector until render cost justifies narrower subscriptions.

## Read for the task

For advanced reactive boundaries, shared atoms, or detailed subscription examples, read [reactivity](references/reactivity.md). For construction or rendering setup, read [getting-started](../getting-started/SKILL.md).

## API discovery

Inspect `node_modules/@tanstack/octane-table/src/index.d.ts`, the matching `*.tsrx.d.ts` sidecar, and `src/types.ts`. This package publishes authored source; core APIs are in installed `@tanstack/table-core/dist/`.
