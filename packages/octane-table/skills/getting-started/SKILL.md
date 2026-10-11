---
name: getting-started
description:
  Create and render Table v9 with the octane adapter. Route reusable createTableHook
  components, and framework setup; use table-state for reactive ownership.
metadata:
  type: framework
  library: '@tanstack/octane-table'
  framework: octane
  library_version: '9.3.0'
requires:
  - '@tanstack/table-core#core'
sources:
  - TanStack/table:docs/framework/octane/quick-start.md
  - TanStack/table:examples/octane/basic-use-table
  - TanStack/table:packages/octane-table/src/index.ts
  - TanStack/table:packages/octane-table/src/useTable.tsrx
  - TanStack/table:docs/framework/octane/guide/composable-tables.md
  - TanStack/table:docs/framework/octane/guide/table-context.md
  - TanStack/table:examples/octane/composable-tables
  - TanStack/table:packages/octane-table/src/createTableHook.tsrx
  - TanStack/table:packages/octane-table/src/createTableHookContexts.ts
---

Load `intent load @tanstack/table-core#core` first for the headless model, stable inputs, and column inference.

## Setup

```tsrx
import { createRoot, useState } from 'octane'
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/octane-table'

type Person = { name: string }
const features = tableFeatures({})
const helper = createColumnHelper<typeof features, Person>()
const columns = helper.columns([helper.accessor('name', { header: 'Name' })])

function PeopleTable() @{
  const [data] = useState<Person[]>([{ name: 'Ada' }])
  const table = useTable({ features, columns, data })

  <table>
    <thead>
      @for (const group of table.getHeaderGroups(); key group.id) {
        <tr>
          @for (const header of group.headers; key header.id) {
            <th><table.FlexRender header={header} /></th>
          }
        </tr>
      }
    </thead>
    <tbody>
      @for (const row of table.getRowModel().rows; key row.id) {
        <tr>
          @for (const cell of row.getAllCells(); key cell.id) {
            <td><table.FlexRender cell={cell} /></td>
          }
        </tr>
      }
    </tbody>
  </table>
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')
createRoot(rootElement).render(PeopleTable)
```

## Construction and rendering

This adapter distributes authored TypeScript and TSRX. Configure the consumer with `octane()` in `vite.config.ts` and the TSRX JSX import source `octane`. Author component bodies with `@{ ... }` and keyed `@for` loops for rows, headers, and cells.

Import from `@tanstack/octane-table`. Render `table.FlexRender` as a component so it gets its own Octane scope. It preserves numbers including `0`, render descriptors, and component functions.

Keep features and column definitions at module scope. For inputs that depend on component state, use `useMemo`; pass the current stable data array to `useTable`. Convert non-renderable values with `String(value)` when displaying them as text.

## Read for the task

- When adding or configuring optional features, load `intent load @tanstack/table-core#table-features` and read only references for the requested behavior.
- For state ownership or reactive reads, read [table-state](../table-state/SKILL.md).
- When tables share features, defaults, or reusable UI, read [create-table-hook](references/create-table-hook.md).

## API discovery

Inspect `node_modules/@tanstack/octane-table/src/index.d.ts`, the matching `*.tsrx.d.ts` sidecar, and `src/types.ts`. This package publishes authored source; core APIs are in installed `@tanstack/table-core/dist/`.
