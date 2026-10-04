# Solid table reactive boundaries

Read when optimizing subscriptions, composing external atoms, or debugging Solid-specific tracking and controlled updates. Shared ownership, initialization, and reset rules remain in `intent load @tanstack/table-core#table-state`.

## Example context

```tsx
import { createMemo } from 'solid-js'

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
const selectedCount = createMemo(
  () => Object.keys(table.atoms.rowSelection.get()).length,
)
return <output>{selectedCount()}</output>
```

## State patterns

### Control with a native signal

```tsx
const [sorting, setSorting] = createSignal([])
const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
  get state() {
    return { sorting: sorting() }
  },
  onSortingChange: setSorting,
})
```

Solid signal setters already accept either a value or an updater function, so pass the setter directly. Wrap it only when adding validation, transformation, or a side effect:

```tsx
onSortingChange: (updater) =>
  setSorting((old) => {
    const next = typeof updater === 'function' ? updater(old) : updater
    logSortingChange(next)
    return next
  })
```

### Own a slice with an external atom

```tsx
import { createAtom } from '@tanstack/solid-store'
const pagination = createAtom({ pageIndex: 0, pageSize: 20 })
const table = createTable({ features, columns, data, atoms: { pagination } })
```

## Common mistakes

### HIGH Reading outside a tracked scope

Wrong:

```tsx
const page = table.atoms.pagination.get().pageIndex
setInterval(() => console.log(page), 1000)
```

Correct:

```tsx
const page = createMemo(() => table.atoms.pagination.get().pageIndex)
setInterval(() => console.log(page()), 1000)
```

An atom read only establishes Solid dependencies inside JSX, a memo, an effect, or another tracked owner.

Source: `docs/framework/solid/guide/table-state.md`

### MEDIUM Adding broad React-style rerenders

Wrong:

```tsx
createEffect(() => {
  JSON.stringify(table.store.state)
  forceUpdate()
})
```

Correct:

```tsx
const count = createMemo(
  () => Object.keys(table.atoms.rowSelection.get()).length,
)
```

Solid should track the narrow atom reads actually used by the computation.

Source: `packages/solid-table/src/createTable.ts`

## API discovery

Inspect `node_modules/@tanstack/solid-table/dist/createTable.d.ts` and `reactivity.d.ts`; state slice definitions and atom precedence are in installed `@tanstack/table-core/dist/`.

## Sources

- `TanStack/table:docs/framework/solid/guide/table-state.md`
- `TanStack/table:examples/solid/basic-external-state`
- `TanStack/table:packages/solid-table/src/createTable.ts`
