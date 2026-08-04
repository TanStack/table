---
name: getting-started
description: >
  Create a native @tanstack/preact-table v9 table with useTable, tableFeatures, stable inputs, row/header models, and Preact FlexRender helpers. Load when starting a Preact table or replacing @tanstack/react-table through preact/compat.
metadata:
  {
    type: framework,
    library: '@tanstack/preact-table',
    library_version: '9.0.0-beta.80',
    framework: preact,
  }
requires: ['@tanstack/table-core#core', '@tanstack/table-core#table-features']
sources:
  - 'TanStack/table:docs/framework/preact/guide/migrating.md'
  - 'TanStack/table:examples/preact/basic-use-table'
  - 'TanStack/table:packages/preact-table/src/index.ts'
---

This skill builds on `@tanstack/table-core#core` and `@tanstack/table-core#table-features`. Use the native Preact adapter, not React through compat.

## Setup

```tsx
import { useState } from 'preact/hooks'
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'

type Person = { name: string }
const features = tableFeatures({})
const helper = createColumnHelper<typeof features, Person>()
const columns = helper.columns([helper.accessor('name', { header: 'Name' })])

export function PeopleTable() {
  const [data] = useState<Person[]>([{ name: 'Ada' }])
  const table = useTable({ features, columns, data })
  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((group) => (
          <tr key={group.id}>
            {group.headers.map((header) => (
              <th key={header.id}>
                <table.FlexRender header={header} />
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

## Core Patterns

### Register only required plugins

```tsx
import {
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/preact-table'
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})
```

### Keep features and columns module-stable

```tsx
const features = tableFeatures({})
const columns = helper.columns([helper.accessor('name', { header: 'Name' })])
```

## Common Mistakes

### HIGH Importing the React adapter through compat

Wrong:

```tsx
import { useTable } from '@tanstack/react-table'
```

Correct:

```tsx
import { useTable } from '@tanstack/preact-table'
```

The native adapter uses Preact hooks, stores, JSX types, and subscriptions directly.

Source: `docs/framework/preact/guide/migrating.md`

### HIGH Copying the v8 constructor

Wrong:

```tsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
})
```

Correct:

```tsx
const table = useTable({ data, columns, features })
```

V9 uses explicit feature slots rather than v8 row-model table options.

Source: `docs/framework/preact/guide/migrating.md`

### MEDIUM Recreating static inputs in render

Wrong:

```tsx
const table = useTable({
  features: tableFeatures({}),
  columns: [{ accessorKey: 'name' }],
  data,
})
```

Correct:

```tsx
const table = useTable({ features, columns, data })
```

New feature and column identities cause needless option and model work.

Source: `examples/preact/basic-use-table`

## API Discovery

Inspect `node_modules/@tanstack/preact-table/dist/index.d.ts`, then `useTable.d.ts`, `Subscribe.d.ts`, or `FlexRender.d.ts`; follow core exports into installed `@tanstack/table-core/dist/`.
