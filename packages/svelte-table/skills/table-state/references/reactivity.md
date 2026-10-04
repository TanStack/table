# Svelte table reactive boundaries

Read when optimizing subscriptions, composing external atoms, or debugging Svelte-specific tracking and controlled updates. Shared ownership, initialization, and reset rules remain in `intent load @tanstack/table-core#table-state`.

## Example context

Keep state internal unless another subsystem needs to own it. Read only the state slices a component needs.

```svelte
<script lang="ts">
  import {
    createTable,
    rowPaginationFeature,
    tableFeatures,
  } from '@tanstack/svelte-table'

  const features = tableFeatures({ rowPaginationFeature })
  const columns = [{ accessorKey: 'name' }]
  let data = $state([{ name: 'Ada' }])

  const table = createTable({
    features,
    columns,
    get data() {
      return data
    },
  })

  const pagination = $derived(table.atoms.pagination.get())
</script>

<button onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
  Page {pagination.pageIndex + 1}
</button>
```

## State patterns

### Read narrow or complete state

```ts
const pagination = $derived(table.atoms.pagination.get())
const pageIndex = $derived(table.atoms.pagination.get().pageIndex)
const rows = $derived(table.getRowModel().rows)
const stateJson = $derived(JSON.stringify(table.store.get(), null, 2))
```

Use atom reads for normal UI. A `table.store.get()` read intentionally re-runs for any registered state change, so reserve it for debug output, persistence, or computations that need the whole state.

### Control a slice with value-or-updater semantics

```ts
import type { PaginationState, Updater } from '@tanstack/svelte-table'

let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 20 })
const updatePagination = (next: Updater<PaginationState>) => {
  pagination = typeof next === 'function' ? next(pagination) : next
}
```

Pass a getter-backed `state.pagination` and `onPaginationChange: updatePagination` to `createTable`.

### Reduce boilerplate with `createTableState`

```ts
import {
  createTable,
  createTableState,
  rowPaginationFeature,
  tableFeatures,
  type PaginationState,
} from '@tanstack/svelte-table'

const features = tableFeatures({ rowPaginationFeature })
const columns = [{ accessorKey: 'name' }]
const data = [{ name: 'Ada' }]
const [pagination, setPagination] = createTableState<PaginationState>({
  pageIndex: 0,
  pageSize: 20,
})

const table = createTable({
  features,
  columns,
  data,
  state: {
    get pagination() {
      return pagination()
    },
  },
  onPaginationChange: setPagination,
})
```

`pagination()` reads the current rune-backed value, while `setPagination` accepts either a value or a functional updater and can be passed directly to `onPaginationChange`.

When code outside table UI consumes a raw external atom, use `useSelector` from `@tanstack/svelte-store`. Inside table UI, use the rune-aware `table.atoms.<slice>.get()` wrapper.

## Common mistakes

### HIGH Keeping removed adapter selectors

Wrong:

```ts
const table = createTable(options, (state) => state.pagination)
const pageIndex = table.state.pageIndex
```

Correct:

```ts
const table = createTable(options)
const pagination = $derived(table.atoms.pagination.get())
```

In v9, `createTable` and `createAppTable` take only options, `table.state` is absent, and `subscribeTable` and `SubscribeSource` are no longer exported. Use native tracked Svelte reads and `$derived` projections.

Source: `docs/framework/svelte/guide/migrating.md`

### HIGH Controlling without writing back

Wrong:

```ts
const options = { state: { pagination }, onPaginationChange: console.log }
```

Correct:

```ts
const options = {
  state: {
    get pagination() {
      return pagination
    },
  },
  onPaginationChange: updatePagination,
}
```

A controlled slice is frozen unless every updater is resolved into the owning rune.

Source: `docs/framework/svelte/guide/table-state.md`

### HIGH Snapshotting outside tracking

Wrong:

```ts
const pageIndex = table.store.get().pagination.pageIndex
```

Correct inside a component:

```ts
const pageIndex = $derived(table.atoms.pagination.get().pageIndex)
```

The first line is only a current snapshot when it runs outside a template or rune. The second line is a narrow native Svelte derivation.

Source: `packages/svelte-table/src/createTable.svelte.ts`

### MEDIUM Declaring one slice in two owners

Wrong:

```ts
const options = { initialState: { pagination: start }, state: { pagination } }
```

Correct:

```ts
const options = {
  state: {
    get pagination() {
      return pagination
    },
  },
}
```

Controlled `atoms` or `state` wins over `initialState`; choose one owner per slice.

Source: `docs/framework/svelte/guide/table-state.md`

### MEDIUM Fighting automatic page reset

Wrong:

```ts
table.setPageIndex(4)
data = filteredData
```

Correct:

```ts
const options = { autoResetPageIndex: false }
```

Client row-model changes reset the page by default; disable it only when the application handles invalid empty pages.

Source: `docs/framework/svelte/guide/pagination.md`

## API discovery

Inspect `node_modules/@tanstack/svelte-table/dist/createTable.svelte.d.ts`, `createTableHook.svelte.d.ts`, and `createTableState.svelte.d.ts`; inspect registered state slices in the matching installed core feature declarations.

## Sources

- `TanStack/table:docs/framework/svelte/guide/table-state.md`
- `TanStack/table:docs/framework/svelte/guide/pagination.md`
- `TanStack/table:examples/svelte/basic-external-state`
- `TanStack/table:packages/svelte-table/src/createTable.svelte.ts`
- `TanStack/table:packages/svelte-table/src/createTableState.svelte.ts`
