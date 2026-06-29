---
name: solid/production-readiness
description: >
  Ship-ready optimizations for `@tanstack/solid-table` v9. Tree-shake by
  registering only the `features` you use; keep `features`, `columns`, `data`
  stable; prefer per-slice external atoms (`createAtom` + `useSelector`) and
  narrow selectors over `(state) => state`; leverage Solid's fine-grained
  reactivity (`createMemo`, JSX-level reads) so most components subscribe to
  exactly the slice they render; reach for `table.Subscribe` only at coarse
  isolation boundaries.
type: lifecycle
library: tanstack-table
framework: solid
library_version: '9.0.0-alpha.48'
requires:
  - setup
  - state-management
  - solid/table-state
sources:
  - docs/guide/features.md
  - docs/framework/solid/guide/table-state.md
  - packages/solid-table/src/createTable.ts
  - examples/solid/basic-external-atoms/
  - examples/solid/virtualized-rows/
---

# Production Readiness — `@tanstack/solid-table`

A v9 table that "works in dev" can still ship slow if you copied the
getting-started shape unchanged into a 10k-row scenario. Solid's fine-grained
reactivity rewards a few production habits.

## 1. Tree-shake `features` aggressively

v9's biggest bundle win. Register only the features you use.

```tsx
// ❌ Pulls everything; defeats the v9 redesign
import { stockFeatures } from '@tanstack/solid-table'
tableFeatures(stockFeatures)

// ✅ Only what you use
import {
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

Same rule for the `*Fns` registries: register only the comparators you use as a `sortFns` slot on `tableFeatures`:

```tsx
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  // Only the comparators you actually use
  sortFns: {
    alphanumeric: sortFns.alphanumeric,
    basic: sortFns.basic,
  },
})
```

## 2. Keep `features`, `data`, `columns` stable

The Solid signal model already protects you from React-style re-creation, but
two patterns still break things:

- **Re-creating `features` per render.** Module-scope it. Don't call
  `tableFeatures({...})` inside a component.
- **Returning a fresh `[]` on every read.** When `data` is unloaded
  (`resource()?.rows ?? []`), the fallback `[]` should be a module-scope
  constant so identity is stable.

```tsx
const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const EMPTY_ROWS: Array<Person> = []

function App() {
  const table = createTable({
    features, // stable — factories are registered on the features object
    columns, // module-scope constant
    get data() {
      return query.data?.rows ?? EMPTY_ROWS
    },
  })
}
```

For `columns` that depend on a reactive source (e.g. a column visibility
preset), wrap them in `createMemo` so identity is stable per inputs:

```tsx
const columns = createMemo(() =>
  columnHelper.columns([
    /* ... */
  ]),
)
createTable({
  features,
  get columns() {
    return columns()
  },
  get data() {
    return data()
  },
})
```

## 3. Prefer narrow selectors over `(state) => state`

The default `createTable(options)` selector is identity. Anything reading
`table.state()` then depends on every slice. Pass a selector:

```tsx
const table = createTable(
  {
    features,
    columns,
    get data() {
      return data()
    },
  },
  (state) => ({ pagination: state.pagination, sorting: state.sorting }),
)
```

For `table.Subscribe` boundaries, the same rule applies — narrow the selector.

## 4. Trust signal-level reactivity over Subscribe wrappers

In Solid, a JSX-level read tracks itself. You usually don't need
`table.Subscribe`:

```tsx
// This <span> updates when pagination changes — fine-grained, no Subscribe needed
<span>Page {table.state().pagination.pageIndex + 1}</span>
```

Reach for `table.Subscribe` when:

- You want an isolated re-render boundary for a large sub-tree.
- You need to subscribe to a single atom/store with `source` (e.g. a specific
  `table.atoms.rowSelection` slice for a single row checkbox).

Not when:

- It's "what React does." Solid is fine without it most of the time.

## 5. Use external atoms for cross-component / server-driven state

`@tanstack/solid-store`'s `createAtom` + `useSelector` is the cleanest pattern
for sharing pagination/sort/filter with TanStack Query, URL params, devtools,
etc.

```tsx
const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 25,
})

// In the table:
createTable({ /* ... */ atoms: { pagination: paginationAtom } })

// In the URL sync hook elsewhere:
const pagination = useSelector(paginationAtom)
createEffect(() => syncUrl(pagination()))
```

This wins over `state`+`on*Change` because every consumer can subscribe to the
atom independently with shallow equality.

## 6. Virtualize when row count >> visible rows

TanStack Table does not include virtualization. For 10k+ row tables, pair with
`@tanstack/solid-virtual` (`createVirtualizer`). Keep the virtualizer ref in
the lowest possible component to avoid re-running it on unrelated updates. See
the `compose-with-tanstack-virtual` skill.

## 7. Use APIs, not handwritten state edits

The #1 AI tell in v9 code: reimplementing what's already there. Examples:

| ❌ Handwritten                                                     | ✅ Built-in                                            |
| ------------------------------------------------------------------ | ------------------------------------------------------ |
| `setPagination((p) => ({ ...p, pageIndex: p.pageIndex + 1 }))`     | `table.nextPage()`                                     |
| Recomputing `selectedRows` from `data` and a `rowSelection` object | `table.getSelectedRowModel().rows`                     |
| Building a "can sort this column?" predicate                       | `column.getCanSort()`                                  |
| Manual range `setPageIndex(Math.min(...))` clamping                | `table.setPageIndex(idx)` (table clamps internally)    |
| Tracking expanded ids in a parallel structure                      | `row.toggleExpanded()` / `table.getExpandedRowModel()` |

If you find yourself recomputing something the table tracks, look for the
matching API.

## 8. Use `tableFeatures()` even if you only need one feature

`tableFeatures()` is the essential, stable wiring for v9. Always go through it.
It's not the "experimental" part — that's only custom-feature **authoring**,
which is excluded from v9 alpha.

## Failure modes

### CRITICAL — registering features you don't use

Every registered feature adds state slices, derivations, and code to the
bundle. Keep `features` minimal.

### CRITICAL — recreating `features` / `columns` / `data` identity on every render

Solid's reactivity assumes stable references for options that are not behind
getters. `features` and `columns` should be module-scoped; reactive options
should use getters; fallbacks should be module-scope constants.

### HIGH — `(state) => state` default selector in a frequently-reading component

If you pass no selector to `createTable` and you read `table.state()` in many
places, you've coupled every component to every slice. Narrow it.

### HIGH — premature `table.Subscribe` on small tables

`Subscribe` is for advanced isolation. A 50-row table doesn't need it. Native
Solid reactivity is already fine-grained.

### HIGH — `stockFeatures` in production

A clear "didn't think about the bundle" tell. Use only the features you render.

### MEDIUM — virtualizer at the wrong scope

Keep `createVirtualizer` in the component that owns the scroll container, not
high up in the tree. Otherwise scroll-driven recompute fires across the page.

### MEDIUM — re-reading `table.state` in JSX

Use `table.state()` for component-level reactive reads, or
`table.atoms.pagination.get()` / `useSelector(table.atoms.pagination)` for
per-slice reads. Avoid direct `table.state` reads in JSX.

### MEDIUM — `autoResetPageIndex: true` on a server-driven table

When `data` changes (a new server page arrives), the auto-reset can fight your
external atom. Set it to `false` for server-side tables.

### LOW — measuring perf with `debugTable: true` left on

`debugTable: true` is a development helper that logs row-model rebuilds. Turn
it off in production builds.
