---
name: svelte/production-readiness
description: >
  Ship-ready optimizations for `@tanstack/svelte-table@9` on Svelte 5. Tree-shake by registering
  ONLY the `features` you use; keep `features`, `columns`, and `data` stable; replace broad
  `(state) => state` selectors with narrow projections on `createTable`; reach for
  `subscribeTable(atom, selector?)` when only one block of markup should react; lean on rune-aware
  atom reads (`table.atoms.<slice>.get()`) for non-reactive paths; key every `{#each}` block on
  stable ids; debounce high-frequency writes with `@tanstack/svelte-pacer`. Svelte 5+ only.
type: lifecycle
library: tanstack-table
framework: svelte
library_version: '9.0.0-alpha.48'
requires:
  - setup
  - state-management
  - svelte/table-state
sources:
  - TanStack/table:docs/guide/features.md
  - TanStack/table:docs/framework/svelte/guide/table-state.md
  - TanStack/table:packages/svelte-table/src/createTable.svelte.ts
  - TanStack/table:packages/svelte-table/src/subscribe.ts
  - TanStack/table:examples/svelte/basic-external-atoms/
  - TanStack/table:examples/svelte/virtualized-rows/
---

# Production Readiness — Svelte

Once your tables work, this is the checklist for making them fast and small. Most of these are
v9-specific — v8 tables won't have any of these levers.

## 1. Register only the features you use

`features` is the bundle gate. Any feature you don't register is tree-shaken out — including
its state slice, its API surface, and its reactive plumbing.

```ts
// good — minimal table, ~smallest bundle
const features = tableFeatures({})

// good — feature-by-feature opt-in
const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
})

// bad — kitchen sink, every state slice created even when unused
const features = tableFeatures({
  columnFilteringFeature,
  columnGroupingFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
})
```

If you find yourself running a table without a feature's UI ever showing, drop the feature.

## 2. Stable identities for `features`, `columns`, `data`

`createTable` syncs options in `$effect.pre`. If any of these identities flip every component
run, the table re-syncs more than it needs to.

- **`features`**: declare at module scope, not inside the component function, and never
  inside `$derived` / `$effect`. The `features` object now also carries row-model factories
  and `*Fns` registries, so keeping it stable prevents unnecessary re-sync.
- **`columns`**: same — module scope or `$state.frozen` / a non-reactive `const` in the
  component. Reactive recompute of columns is rare and almost always a bug.
- **`data`**: pass with a getter (`get data()`) so the reference is stable when the data
  doesn't change. If you're reshaping data inside the component, do it once in a `$derived`,
  not on every read.

```svelte
<script lang="ts">
  // module scope is fine in .svelte too, when truly static
  const features = tableFeatures({
    rowPaginationFeature,
    paginatedRowModel: createPaginatedRowModel(),
  })
  const columns = columnHelper.columns([
    /* ... */
  ])

  let rawRows = $state<Person[]>([])
  const data = $derived(rawRows.map(normalize)) // computed once per rawRows change

  const table = createTable({
    features,
    columns,
    get data() {
      return data
    },
  })
</script>
```

## 3. Narrow the `table.state` selector

The default selector is `(state) => state`. That makes `table.state` re-run any consumer when
**any** slice changes. Pass a focused selector and you only re-render markup that actually
depends on that slice.

```ts
// good — only re-projects when pagination changes
const table = createTable(options, (state) => ({
  pagination: state.pagination,
}))

// even better — only what your UI actually reads
const table = createTable(options, (state) => ({
  pageIndex: state.pagination.pageIndex,
  pageSize: state.pagination.pageSize,
}))
```

If different parts of the UI need different slices, **don't** widen the selector — use
`subscribeTable` instead (next section).

## 4. Reach for `subscribeTable` for fine-grained reactivity

`subscribeTable(source, selector?)` is the per-block subscription. It returns an object whose
`.current` re-runs only when the selected value changes (shallow compared).

```svelte
<script lang="ts">
  import { subscribeTable } from '@tanstack/svelte-table'

  // dedicated subscription for the pager
  const pagination = subscribeTable(table.atoms.pagination)

  // dedicated subscription for a single row's selection state
  const isSelected = subscribeTable(
    table.atoms.rowSelection,
    (rs) => !!rs[row.id],
  )
</script>

<input type="checkbox" checked={isSelected.current} />
```

Use it inside per-row components — the row block re-renders only on its own selection toggle,
not on every row's toggle.

## 5. Non-reactive reads where you don't need reactivity

Inside event handlers, derived calculations, or one-shot logic, read atoms directly. Cheaper
than subscribing.

```ts
function exportSelected() {
  const selection = table.atoms.rowSelection.get()
  const selectedIds = Object.keys(selection).filter((id) => selection[id])
  // ...
}
```

`table.state` is the same idea for a full snapshot.

## 6. Key every `{#each}` block on a stable id

Svelte without keys recreates nodes on reorder. Result: lost input focus, lost scroll, lost
component state. Every TanStack Table loop has a stable id.

```svelte
{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
  <tr>
    {#each headerGroup.headers as header (header.id)}
      <th>...</th>
    {/each}
  </tr>
{/each}

{#each table.getRowModel().rows as row (row.id)}
  <tr>
    {#each row.getVisibleCells() as cell (cell.id)}
      <td>...</td>
    {/each}
  </tr>
{/each}
```

## 7. Don't fight `$effect.pre`

`createTable` is already syncing options in `$effect.pre`. Don't write a second `$effect`
that calls `table.setOptions` — it'll race with the built-in sync and may render with stale
state.

If you need to react to an option change with a side effect, put the side effect in your own
`$effect`, not the option write.

## 8. Debounce high-frequency writes

Two places will hammer table state at keystroke / pointermove rate:

- **Filter inputs.** Wrap `setFilterValue` calls with a debounced callback.
- **Column resizing.** v9 commits `columnSizing` continuously by default; use the resize-end
  commit mode or debounce.

```ts
import { createDebouncer } from '@tanstack/svelte-pacer/debouncer'

const debouncedSetFilter = createDebouncer(
  (value: string) => column.setFilterValue(value),
  { wait: 200 },
)
```

See the `compose-with-tanstack-pacer` skill for full examples.

## 9. Virtualization for large datasets

`getRowModel().rows.length > ~1000` and rows are simple? Performance is fine without
virtualization. Above that, or with heavy per-row markup, use `@tanstack/svelte-virtual`. See
the `compose-with-tanstack-virtual` skill.

## 10. Don't ship debug flags

`debugTable: true`, `debugRows`, `debugHeaders` all log. Strip them or gate on `import.meta.env.DEV`.

## 11. Don't reimplement built-ins

The #1 production-readiness regression we see in audits: somebody hand-rolled the thing the
table already does. If you're writing any of these, register the feature instead.

- Hand-rolled sort comparator across rows → `rowSortingFeature` + `createSortedRowModel`
- Hand-rolled page math (`rows.slice(start, end)`) → `rowPaginationFeature` +
  `createPaginatedRowModel`
- Hand-rolled selection toggle (`selected[row.id] = !selected[row.id]`) → `rowSelectionFeature`
- Hand-rolled column hide map → `columnVisibilityFeature`
- Hand-rolled column resizer → `columnResizingFeature`
- Hand-rolled debounced filter that doesn't update through `setFilterValue` →
  `columnFilteringFeature` + pacer

Each rewrite breaks tree-shaking, breaks the reset APIs, and breaks devtools introspection.

## Quick smoke test before shipping

- Bundle: does the table chunk match the features you registered? (`pnpm build` and inspect.)
- DevTools profiler: clicking sort triggers exactly one re-render of the headers and rows,
  not every consumer of `table.state`.
- Resize / filter: no jank, no per-keystroke server hits (pacer / debounce).
- Reload: state restored from your atom / URL / storage, no flicker.
- Stress: 100k-row dataset with virtualization stays interactive.

## Related skills

- `tanstack-table/svelte/table-state` — selectors, atoms, subscribeTable.
- `tanstack-table/svelte/compose-with-tanstack-pacer` — debounce patterns.
- `tanstack-table/svelte/compose-with-tanstack-virtual` — virtualization.
- `tanstack-table/svelte/compose-with-tanstack-store` — atom ownership patterns.
