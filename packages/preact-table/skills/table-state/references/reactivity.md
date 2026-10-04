# Preact table reactive boundaries

Read when optimizing subscriptions, composing external atoms, or debugging Preact-specific tracking and controlled updates. Shared ownership, initialization, and reset rules remain in `intent load @tanstack/table-core#table-state`.

## Example context

```tsx
const table = useTable({ features, columns, data }, (state) => ({
  pagination: state.pagination,
}))
return <output>{table.state.pagination.pageIndex + 1}</output>
```

The selector determines rerenders and the shape exposed on `table.state`; omission selects all registered slices.

## State patterns

### Fine-grained Preact subscription

```tsx
return (
  <table.Subscribe source={table.atoms.rowSelection}>
    {(selection) => <output>{Object.keys(selection).length}</output>}
  </table.Subscribe>
)
```

### External atom ownership

```tsx
import { useCreateAtom } from '@tanstack/preact-store'
const pagination = useCreateAtom({ pageIndex: 0, pageSize: 20 })
const table = useTable({ features, columns, data, atoms: { pagination } })
```

## Common mistakes

### HIGH Reading snapshots as subscriptions

Wrong:

```tsx
const page = table.store.state.pagination.pageIndex
```

Correct:

```tsx
const page = table.state.pagination.pageIndex
```

Store and atom `.get()` reads are snapshots; selected `table.state` or `Subscribe` connects a Preact render.

Source: `packages/preact-table/src/useTable.ts`

### HIGH Controlling only the callback

Wrong:

```tsx
useTable({ features, columns, data, onPaginationChange: setPagination })
```

Correct:

```tsx
useTable({
  features,
  columns,
  data,
  state: { pagination },
  onPaginationChange: setPagination,
})
```

The callback must write into the value supplied for that controlled slice.

Source: `docs/framework/preact/guide/table-state.md`

### MEDIUM Narrowing away rendered dependencies

Wrong:

```tsx
const table = useTable(options, (state) => ({ pagination: state.pagination }))
return table.getSelectedRowModel().rows.length
```

Correct:

```tsx
const table = useTable(options, (state) => ({
  pagination: state.pagination,
  rowSelection: state.rowSelection,
}))
return table.getSelectedRowModel().rows.length
```

If render output depends on selection, the owning render boundary must subscribe to it directly or via `Subscribe`.

Source: `examples/preact/basic-subscribe`

## API discovery

Inspect `node_modules/@tanstack/preact-table/dist/useTable.d.ts` and `Subscribe.d.ts`; use `@tanstack/preact-store` rather than React Store hooks.

## Sources

- `TanStack/table:docs/framework/preact/guide/table-state.md`
- `TanStack/table:examples/preact/basic-subscribe`
- `TanStack/table:packages/preact-table/src/useTable.ts`
