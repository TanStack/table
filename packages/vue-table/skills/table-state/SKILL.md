---
name: table-state
description: Read and control Table v9 state in vue. Use for tracked reads, subscriptions, controlled slices, and framework-specific reactive boundaries.
metadata:
  type: framework
  library: '@tanstack/vue-table'
  framework: vue
  library_version: '9.2.6'
requires:
  - '@tanstack/table-core#table-state'
sources:
  - TanStack/table:docs/framework/vue/guide/table-state.md
  - TanStack/table:examples/vue/basic-external-state
  - TanStack/table:packages/vue-table/src/useTable.ts
---

# Vue table state

Before starting, run `intent load @tanstack/table-core#table-state` for shared ownership, initialization, updates, and resets.

## Read reactive state

Vue-backed atom reads track dependencies inside templates, `computed`, `watch`, or a render boundary. `const page = table.atoms.pagination.get()` outside tracking captures a snapshot. Keep reactive option inputs as refs, computed values, or getters; passing `.value` once breaks later synchronization.

`table.Subscribe` receives atoms in an explicit `children` prop. Vue JSX children become slots, so use `<table.Subscribe children={(atoms) => <span>{atoms.pagination.get().pageIndex}</span>} />`.

## Control a slice

Keep features and columns stable. Preserve both the reactive value and its matching callback:

```ts
import { computed, ref } from 'vue'
import {
  rowPaginationFeature,
  tableFeatures,
  useTable,
  type PaginationState,
  type Updater,
} from '@tanstack/vue-table'

const features = tableFeatures({ rowPaginationFeature })
const columns = [{ accessorKey: 'name' }]
const data = ref([{ name: 'Ada' }])
const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 20 })
const state = computed(() => ({ pagination: pagination.value }))
const table = useTable({
  features,
  columns,
  data,
  state,
  onPaginationChange: (next: Updater<PaginationState>) => {
    pagination.value =
      typeof next === 'function' ? next(pagination.value) : next
  },
})
const pageSize = computed(() => table.atoms.pagination.get().pageSize)
```

Assign the resolved updater result to the ref. For shared atom ownership, use a stable `@tanstack/vue-store` atom in `atoms.<slice>` instead of mirroring the same slice in controlled refs.

For computed-state synchronization failures, updater mistakes, or JSX subscription boundaries, read [reactivity details](references/reactivity.md). If this task changes processing features, run `intent load @tanstack/table-core#table-features` and read the relevant feature references.

## API discovery

Inspect `node_modules/@tanstack/vue-table/dist/useTable.d.ts` and `reactivity.d.ts`; inspect the matching core feature declarations for the controlled slice.
