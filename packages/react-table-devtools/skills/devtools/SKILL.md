---
name: devtools
description: >
  Connect React Table v9 instances to Devtools with tableDevtoolsPlugin and useTanStackTableDevtools. Load for missing Table panels, registration lifecycle, required options.key, enabled state, or development versus explicit production exports.
metadata:
  type: framework
  library: '@tanstack/react-table-devtools'
  framework: react
  library_version: '9.0.0-beta.59'
requires:
  - '@tanstack/table-core#core'
  - '@tanstack/table-devtools#devtools'
sources:
  - 'TanStack/table:docs/devtools.md'
  - 'TanStack/table:packages/react-table-devtools/src/index.ts'
  - 'TanStack/table:packages/react-table-devtools/src/useTanStackTableDevtools.ts'
---

This skill builds on @tanstack/table-core#core and @tanstack/table-devtools#devtools.

## Setup

```tsx
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useTable, tableFeatures } from '@tanstack/react-table'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/react-table-devtools'

const features = tableFeatures({})
const columns = [{ accessorKey: 'id' }]
const data: Array<{ id: string }> = []

export function App() {
  const table = useTable({
    key: 'users-table',
    features,
    columns,
    data,
  })
  useTanStackTableDevtools(table)
  return <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
}
```

## Hooks and Components

Use `useTanStackTableDevtools(table, { enabled })` immediately after creating the table. Mount one TanStackDevtools host with `tableDevtoolsPlugin()` near the application root.

## Common Mistakes

### HIGH Hook receives a keyless table

Wrong: create the table without `key` and expect the hook to infer a name.

Correct: set a unique `key` in table options before calling the hook.

Core target registration skips keyless tables.

Source: TanStack/table:docs/devtools.md

### HIGH Hook called conditionally

Wrong: call `useTanStackTableDevtools` only inside an `if` branch.

Correct: call it every render and pass `{ enabled: condition }`.

The hook owns React effect registration and cleanup.

Source: TanStack/table:packages/react-table-devtools/src/useTanStackTableDevtools.ts

### MEDIUM Default import expected in production

Wrong: expect the normal hook/plugin/panel to inspect production tables.

Correct: keep normal guidance development-only; use the `/production` entrypoint only when explicitly required.

The default index selects no-op implementations outside development.

Source: TanStack/table:packages/react-table-devtools/src/index.ts

## API Discovery

Inspect `node_modules/@tanstack/react-table-devtools/dist/index.d.ts` and `useTanStackTableDevtools.d.ts` for the installed lifecycle API.
