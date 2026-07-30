---
name: getting-started
description: >
  Create a Solid Table v9 table with createTable, explicit tableFeatures, reactive data getters, stable static inputs, and Solid JSX/FlexRender. Load when starting a Solid table, replacing createSolidTable, or adapting React examples.
metadata:
  {
    type: framework,
    library: '@tanstack/solid-table',
    library_version: '9.0.0-beta.61',
    framework: solid,
  }
requires: ['@tanstack/table-core#core', '@tanstack/table-core#table-features']
sources:
  - 'TanStack/table:docs/framework/solid/guide/migrating.md'
  - 'TanStack/table:examples/solid/basic-use-table'
  - 'TanStack/table:packages/solid-table/src/index.tsx'
---

This skill builds on `@tanstack/table-core#core` and `@tanstack/table-core#table-features`. Solid Table supplies reactive models; the application still renders and styles its own headless markup.

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

## Core Patterns

### Expose changing inputs through getters

```tsx
const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
```

### Keep feature definitions static

```tsx
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})
```

## Common Mistakes

### HIGH Using the v8 constructor

Wrong:

```tsx
const table = createSolidTable({ data: data(), columns })
```

Correct:

```tsx
const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
```

V9 uses `createTable`, explicit features, and reactive option access.

Source: `docs/framework/solid/guide/migrating.md`

### HIGH Passing a signal snapshot

Wrong:

```tsx
const table = createTable({ features, columns, data: data() })
```

Correct:

```tsx
const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
```

The snapshot is read once; the getter lets the adapter track later signal changes.

Source: `examples/solid/basic-use-table`

### HIGH Expecting Table to render UI

Wrong:

```tsx
return <div>{table}</div>
```

Correct:

```tsx
return <For each={table.getRowModel().rows}>{(row) => <div>{row.id}</div>}</For>
```

Table is headless; Solid markup, CSS, semantics, and interactions remain renderer-owned.

Source: `packages/solid-table/src/createTable.ts`

## API Discovery

Inspect `node_modules/@tanstack/solid-table/dist/index.d.ts`, then `createTable.d.ts`, `FlexRender.d.ts`, and installed core feature directories.
