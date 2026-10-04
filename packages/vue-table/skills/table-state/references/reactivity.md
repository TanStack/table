# Vue table reactive boundaries

Read when optimizing subscriptions, composing external atoms, or debugging Vue-specific tracking and controlled updates. Shared ownership, initialization, and reset rules remain in `intent load @tanstack/table-core#table-state`.

## Example context

```ts
import { computed, ref } from 'vue'
import {
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'

const features = tableFeatures({ rowPaginationFeature })
const data = ref([{ name: 'Ada' }])
const columns = [{ accessorKey: 'name' }]
const table = useTable({ features, columns, data })
const pageIndex = computed(() => table.atoms.pagination.get().pageIndex)
```

Internal state is usually enough. Atom reads are reactive only when Vue evaluates them in a tracked template, computed, watch, or render boundary.

## State patterns

### Control a slice without losing updater semantics

```ts
import { computed, ref } from 'vue'
import type { PaginationState } from '@tanstack/vue-table'

const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 20 })
const controlledState = computed(() => ({ pagination: pagination.value }))
const onPaginationChange = (
  next: PaginationState | ((old: PaginationState) => PaginationState),
) => {
  pagination.value = typeof next === 'function' ? next(pagination.value) : next
}
```

Pass `state: controlledState` and `onPaginationChange` to `useTable`.

### Use Subscribe as a render boundary

```tsx
table.Subscribe({
  children: (atoms) => <span>{atoms.pagination.get().pageIndex + 1}</span>,
})
```

In Vue JSX, `children` is an explicit prop, not a slot child.

## Common mistakes

### HIGH Reading an untracked snapshot

Wrong:

```ts
const pageIndex = table.atoms.pagination.get().pageIndex
```

Correct:

```ts
const pageIndex = computed(() => table.atoms.pagination.get().pageIndex)
```

The first read is current but does not make its consumer reactive.

Source: `docs/framework/vue/guide/table-state.md`

### HIGH Passing state.value once

Wrong:

```ts
const table = useTable({
  features,
  columns,
  data,
  state: controlledState.value,
})
```

Correct:

```ts
const table = useTable({ features, columns, data, state: controlledState })
```

The adapter watches the computed ref; a one-time `.value` breaks future option synchronization.

Source: `packages/vue-table/src/useTable.ts`

### HIGH Assigning updater functions as values

Wrong:

```ts
const onPaginationChange = (next) => {
  pagination.value = next
}
```

Correct:

```ts
const onPaginationChange = (next) => {
  pagination.value = typeof next === 'function' ? next(pagination.value) : next
}
```

Table callbacks accept either a value or a function of the previous value.

Source: `examples/vue/basic-external-state/src/App.tsx`

### MEDIUM Supplying JSX children as a slot

Wrong:

```tsx
<table.Subscribe>
  {(atoms) => <span>{atoms.pagination.get().pageIndex}</span>}
</table.Subscribe>
```

Correct:

```tsx
<table.Subscribe
  children={(atoms) => <span>{atoms.pagination.get().pageIndex}</span>}
/>
```

The Vue adapter declares `Subscribe(props: { children })` and expects the explicit prop.

Source: `packages/vue-table/src/useTable.ts`

## API discovery

Inspect `node_modules/@tanstack/vue-table/dist/useTable.d.ts` and `reactivity.d.ts`; inspect the exact state slice in the installed core feature directory.

## Sources

- `TanStack/table:docs/framework/vue/guide/table-state.md`
- `TanStack/table:examples/vue/basic-external-state`
- `TanStack/table:packages/vue-table/src/useTable.ts`
