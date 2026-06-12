---
name: solid/getting-started
description: >
  End-to-end first table with `@tanstack/solid-table` v9. Install, declare
  `features` via `tableFeatures()` (including row model factories such as
  `sortedRowModel: createSortedRowModel()` and the matching `sortFns` slot),
  create a column helper with `createColumnHelper<typeof features, TData>()`,
  build the table with `createTable(options)` using reactive `get data() {...}`
  getters, and render rows via `FlexRender` (or `table.FlexRender`).
type: lifecycle
library: tanstack-table
framework: solid
library_version: '9.0.0-alpha.48'
requires:
  - setup
  - column-definitions
  - state-management
  - solid/table-state
sources:
  - docs/installation.md
  - docs/framework/solid/solid-table.md
  - docs/framework/solid/guide/table-state.md
  - packages/solid-table/src/createTable.ts
  - examples/solid/basic-use-table/
  - examples/solid/basic-app-table/
---

# Getting Started — `@tanstack/solid-table`

A working Solid table from a clean install. The five steps below cover every
concept you will need before reaching for feature-specific skills.

## 1. Install

```bash
pnpm add @tanstack/solid-table
# or
npm install @tanstack/solid-table
```

`@tanstack/solid-table` re-exports everything from `@tanstack/table-core` plus
the Solid-specific `createTable`, `FlexRender`, and `createTableHook`. You
should not install `@tanstack/table-core` separately.

## 2. Declare features (`features`)

v9 is explicit about what a table uses. Only registered features expose APIs
and state slices. This is what makes the bundle tree-shake.

```tsx
import {
  tableFeatures,
  rowPaginationFeature,
  rowSortingFeature,
  columnFilteringFeature,
} from '@tanstack/solid-table'

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  columnFilteringFeature,
})
```

`tableFeatures()` is **essential** — it produces a stable typed `TFeatures`
object used everywhere (column helper, table options, etc.). Use it even for a
no-feature table: `tableFeatures({})`.

## 3. Register row-model factories in `tableFeatures()`

Each non-core row-model feature needs its factory registered inside `tableFeatures()`.
The core row model is included by default. Pass the matching `*Fns` registry as
a slot so it is tree-shakeable too.

```tsx
import {
  tableFeatures,
  rowPaginationFeature,
  rowSortingFeature,
  columnFilteringFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  createFilteredRowModel,
  sortFns,
  filterFns,
} from '@tanstack/solid-table'

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  columnFilteringFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortFns,
  filterFns,
})
```

You may also pass a narrowed fns object like `sortFns: { alphanumeric: sortFns.alphanumeric }`
instead of the full registry.

## 4. Define columns

`createColumnHelper` takes **both** generics: `typeof features` first, then
`TData`. (This is the v9 ordering. v8 only had `TData`.)

```tsx
import { createColumnHelper } from '@tanstack/solid-table'

type Person = { firstName: string; lastName: string; age: number }

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: () => <span>Last Name</span>,
  }),
  columnHelper.accessor('age', { header: 'Age' }),
])
```

`columnHelper.columns([...])` preserves each column's individual `TValue` type.
Prefer it over a bare array.

## 5. Create the table and render

```tsx
import { createTable, FlexRender } from '@tanstack/solid-table'
import { For, createSignal } from 'solid-js'

function App() {
  const [data, setData] = createSignal<Array<Person>>([
    { firstName: 'tanner', lastName: 'linsley', age: 24 },
    { firstName: 'kevin', lastName: 'vandy', age: 12 },
  ])

  const table = createTable({
    features,
    columns,
    get data() {
      return data() // reactive getter
    },
  })

  return (
    <table>
      <thead>
        <For each={table.getHeaderGroups()}>
          {(hg) => (
            <tr>
              <For each={hg.headers}>
                {(header) => (
                  <th>
                    {header.isPlaceholder ? null : (
                      <FlexRender header={header} />
                    )}
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
                    <FlexRender cell={cell} />
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

That's a complete v9 Solid table.

## Alternative entry point: `createTableHook`

If you have more than one table sharing features and row models, declare them
once with `createTableHook`:

```tsx
import { createTableHook } from '@tanstack/solid-table'

const { createAppTable, createAppColumnHelper } = createTableHook({
  features: tableFeatures({}),
})

const columnHelper = createAppColumnHelper<Person>()

function App(props: { data: Array<Person> }) {
  const table = createAppTable({
    columns,
    get data() {
      return props.data
    },
  })
  // ...
}
```

`createAppTable` returns a normal `SolidTable` plus app-wrapper components
(`AppTable`, `AppCell`, `AppHeader`, `AppFooter`). See the table-state skill.

## Common pitfalls

### Forgetting `get` on reactive options

```tsx
// ❌ Reads once at construction — table never updates when data() changes
createTable({ features, columns, data: data() })

// ✅ Tracked
createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
```

Use getters for any option that depends on a reactive source: `data`, dynamic
`columns`, controlled `state` slices, `rowCount`, etc.

### Calling `table.state` as a value

`table.state` is an Accessor (a function). Always call it:

```tsx
// ❌
table.state.pagination

// ✅
table.state().pagination
```

### Missing feature → missing API

If you write `table.setSorting(...)` without `rowSortingFeature` in `features`,
TS errors and the method is undefined at runtime. The fix is registration, not
a cast.

### Bundling `stockFeatures` defeats the v9 tree-shake

Don't import everything. Register only the features you use. A no-feature table
is `tableFeatures({})` — not `stockFeatures`.

### Reimplementing built-ins

v9 already exposes `table.setSorting`, `table.nextPage`, `column.toggleVisibility`,
`row.toggleSelected`, `column.setFilterValue`, etc. Reach for the API before
rolling your own state update.

### Hallucinated names from older versions

v9 is `createTable`, not `createSolidTable` (that was v8). Row model factories
go inside `tableFeatures()`, not as top-level `getCoreRowModel` / `getSortedRowModel`
options and not in a separate `rowModels` option.
`createColumnHelper` takes `<typeof features, TData>` (two generics, features
first).
