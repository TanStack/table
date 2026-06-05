---
name: setup
description: >
  Install a TanStack Table v9 framework adapter and wire up a first table with
  `tableFeatures({...})` declaring `features`, an `rowModels` map of factory
  results (`createSortedRowModel(sortFns)`, `createFilteredRowModel(filterFns)`,
  `createPaginatedRowModel()`, …), a `createColumnHelper<typeof features, TData>()`
  column set, and the framework `useTable` / `injectTable` / `createTable` /
  `constructTable` entry point. Covers the registry model, why `features` must
  be module-scoped, when to reach for `stockFeatures`, and `coreFeatures`.
type: core
library: tanstack-table
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - column-definitions
sources:
  - TanStack/table:docs/installation.md
  - TanStack/table:docs/overview.md
  - TanStack/table:docs/guide/tables.md
  - TanStack/table:docs/guide/features.md
  - TanStack/table:packages/table-core/src/index.ts
  - TanStack/table:examples/react/basic-use-table/src/main.tsx
---

This skill builds on `tanstack-table/state-management` and `tanstack-table/column-definitions`. Read those first for the v9 atom model and the `createColumnHelper<typeof features, TData>()` shape.

## Setup

TanStack Table v9 separates a framework-agnostic core (`@tanstack/table-core`) from per-framework adapters. Every table — vanilla or framework — must declare two new v9-required options at construction time: `features` (the registry of feature plugins) and `rowModels` (the map of pipeline factories).

```ts
// Framework-agnostic, using @tanstack/table-core directly.
import {
  constructTable,
  tableFeatures,
  createColumnHelper,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
} from '@tanstack/table-core'

type Person = { firstName: string; lastName: string; age: number }

// 1. Declare features at MODULE scope (stable reference). This is required —
//    a fresh `features` object on every call destroys feature registration.
const features = tableFeatures({ rowSortingFeature })

// 2. Build a column helper bound to BOTH TFeatures and TData.
const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First' }),
  columnHelper.accessor('lastName', { header: 'Last' }),
  columnHelper.accessor('age', { header: 'Age', sortFn: 'alphanumeric' }),
])

const data: Person[] = [
  { firstName: 'Ada', lastName: 'Lovelace', age: 36 },
  { firstName: 'Grace', lastName: 'Hopper', age: 85 },
]

const table = constructTable({
  features,
  rowModels: {
    // Pair every feature with its matching row-model factory.
    sortedRowModel: createSortedRowModel(sortFns),
  },
  columns,
  data,
})

// Read header groups and row model to render.
table.getHeaderGroups()
table.getRowModel().rows
```

Framework adapters wrap this with reactivity:

| Framework                      | Entry point                                    | Package                   |
| ------------------------------ | ---------------------------------------------- | ------------------------- |
| React, Preact, Vue, Solid, Lit | `useTable` / `createTable` / `TableController` | `@tanstack/<fw>-table`    |
| Angular                        | `injectTable`                                  | `@tanstack/angular-table` |
| Svelte 5                       | `createTable` (runes)                          | `@tanstack/svelte-table`  |
| Vanilla JS                     | `constructTable` + `storeReactivityBindings()` | `@tanstack/table-core`    |

## Core Patterns

### Minimum table (no extra features)

```ts
const features = tableFeatures({}) // core features only
const table = constructTable({
  features,
  rowModels: {}, // core row model auto-included
  columns,
  data,
})
```

`tableFeatures({})` is the canonical "I only want the core read pipeline" setup.

### Add features and their row models together

```ts
import {
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  createSortedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  sortFns,
  filterFns,
} from '@tanstack/table-core'

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
})

const table = constructTable({
  features,
  rowModels: {
    sortedRowModel: createSortedRowModel(sortFns),
    filteredRowModel: createFilteredRowModel(filterFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
  columns,
  data,
})
```

Each feature and its row-model factory are registered together — TypeScript exposes the feature's APIs (`table.setSorting`, `table.nextPage`, `table.setColumnFilters`) only when its feature plugin is present in `features`.

### Vanilla JS reactivity binding

```ts
import { constructTable, tableFeatures } from '@tanstack/table-core'
import { storeReactivityBindings } from '@tanstack/table-core'

const features = tableFeatures({})

const table = constructTable({
  features,
  rowModels: {},
  columns,
  data,
  _rowModelFns: {},
  // Use the vanilla binding when no framework adapter exists
  _processingMode: 'core',
})

// Subscribe to a slice
const unsub = table.atoms.sorting.subscribe((sorting) => {
  console.log('sorting changed', sorting)
})
```

### `stockFeatures` for v8-like "everything on"

Reach for this only as a transitional aid. It re-introduces v8 bundle size (~15–20kb) and undoes v9's tree-shaking benefit.

```ts
import { stockFeatures, tableFeatures } from '@tanstack/table-core'

// Discouraged in new code. Register only what you use.
const features = tableFeatures(stockFeatures)
```

## Common Mistakes

### [CRITICAL] API/state slice missing because the feature was not registered in `features`

Wrong:

```ts
// rowSortingFeature missing — table.setSorting / state.sorting unavailable
const features = tableFeatures({}) // empty
const table = useTable({ features, rowModels: {}, columns, data })
table.setSorting([{ id: 'age', desc: true }]) // ❌ does not exist on this table type
```

Correct:

```ts
// Register every feature you intend to use; pair with its row model when applicable
const features = tableFeatures({ rowSortingFeature, rowPaginationFeature })
const table = useTable({
  features,
  rowModels: {
    sortedRowModel: createSortedRowModel(sortFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
  columns,
  data,
})
```

In v9, `features` is a tree-shakeable registry — TypeScript hides APIs for unregistered features and the runtime atom is never created. Agents who see `table.setColumnFilters` "missing" often incorrectly conclude the API was removed.

Source: maintainer interview (Phase 4, 2026-05-17)

### [CRITICAL] Hallucinating v7 / v8 `useReactTable` + `getCoreRowModel()` shape

Wrong:

```ts
// v7
import { useTable, useSortBy } from 'react-table'
const table = useTable({ columns, data }, useSortBy)

// v8
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
})
```

Correct:

```ts
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
} from '@tanstack/react-table'

const features = tableFeatures({ rowSortingFeature })
const table = useTable({
  features,
  rowModels: { sortedRowModel: createSortedRowModel(sortFns) },
  columns,
  data,
})
```

v7→v8 and v8→v9 both reshaped the API substantially. Agents trained on older data confidently emit v7/v8 shapes; v9 enforces `features` + `rowModels`.

Source: maintainer interview (Phase 4, 2026-05-17)

### [HIGH] Calling `tableFeatures({})` inside the component body

Wrong:

```tsx
function MyTable() {
  // ❌ new object every render — destroys stable feature registration
  const features = tableFeatures({ rowSortingFeature })
  const table = useTable({ features, rowModels: {}, columns, data })
}
```

Correct:

```tsx
// ✅ module-scoped, stable reference
const features = tableFeatures({ rowSortingFeature })

function MyTable() {
  const table = useTable({ features, rowModels: {}, columns, data })
}
```

A fresh `features` reference on each render churns the table's feature registry — the same way unstable `columns` or `data` cause infinite re-renders. Hoist to module scope or memoize.

Source: docs/guide/data.md; examples/react/basic-use-table/src/main.tsx

### [HIGH] Adding a row-model factory without registering its feature

Wrong:

```ts
// rowSortingFeature missing — sortedRowModel is orphaned and never runs
const features = tableFeatures({ rowPaginationFeature })
const table = useTable({
  features,
  rowModels: {
    sortedRowModel: createSortedRowModel(sortFns), // no-op
    paginatedRowModel: createPaginatedRowModel(),
  },
  columns,
  data,
})
```

Correct:

```ts
const features = tableFeatures({ rowSortingFeature, rowPaginationFeature })
const table = useTable({
  features,
  rowModels: {
    sortedRowModel: createSortedRowModel(sortFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
  columns,
  data,
})
```

Row-model factories only run if their matching feature is in `features`. Runtime silently degrades.

Source: docs/guide/row-models.md; examples/react/basic-external-atoms/src/main.tsx

### [CRITICAL] Reimplementing what built-in APIs already provide

Wrong:

```ts
// ❌ Reimplements sorting state manually instead of using the API
const [sorting, setSorting] = useState([])
const sortedData = useMemo(() => [...data].sort((a, b) => /* …custom… */), [data, sorting])
// then uses sortedData directly, bypassing the table
```

Correct:

```ts
const table = useTable({
  features: tableFeatures({ rowSortingFeature }),
  rowModels: { sortedRowModel: createSortedRowModel(sortFns) },
  columns,
  data,
})
// then: table.setSorting(...), column.toggleSorting(), header.getToggleSortingHandler()
```

TanStack Table IS a state-management coordinator. The maintainer flags hand-rolled state/sort/filter loops as the #1 tell that an AI wrote the code. Reach for `table.setSorting`, `row.toggleSelected`, `table.nextPage`, `table.setColumnFilters`, `column.toggleVisibility` first.

Source: maintainer interview (Phase 4, 2026-05-17)

### [HIGH] Bundling `stockFeatures` when only a few features are used

Wrong:

```ts
// Pulls in every feature even though only sorting+pagination are used
import { stockFeatures, tableFeatures } from '@tanstack/react-table'
const features = tableFeatures(stockFeatures)
```

Correct:

```ts
import {
  tableFeatures,
  rowSortingFeature,
  rowPaginationFeature,
} from '@tanstack/react-table'
const features = tableFeatures({ rowSortingFeature, rowPaginationFeature })
```

Tree-shaking via `features` is the headline reason for the v9 redesign. `stockFeatures` exists as a v8-style transitional escape hatch, not a default.

Source: maintainer interview (Phase 4, 2026-05-17)

### [CRITICAL] Empty array literal for `data` causes infinite re-renders

Wrong:

```tsx
// ❌ Fresh [] each render — infinite loop when items is undefined
const table = useTable({
  features,
  rowModels: {},
  columns,
  data: items ?? [],
})
```

Correct:

```tsx
// ✅ Hoist the empty fallback OR memoize
const EMPTY: Person[] = []

const table = useTable({
  features,
  rowModels: {},
  columns,
  data: items ?? EMPTY,
})
// or: const data = useMemo(() => items ?? [], [items])
```

A new `[]` reference each render means the table sees a fresh `data` prop and rebuilds row models. Top recurring beginner issue.

Source: https://github.com/TanStack/table/issues/4566; https://github.com/TanStack/table/issues/6002

## See also

- `tanstack-table/state-management` — atom model, ownership precedence, state slices
- `tanstack-table/column-definitions` — `createColumnHelper<typeof features, TData>()` and `getRowId`
- `tanstack-table/migrate-v8-to-v9` — full rename + restructure table for v8 → v9 upgrades
