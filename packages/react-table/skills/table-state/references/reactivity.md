# React table reactive boundaries

Read when optimizing subscriptions, composing external atoms, or debugging React-specific tracking and controlled updates. Shared ownership, initialization, and reset rules remain in `intent load @tanstack/table-core#table-state`.

## Example context

```tsx
import {
  rowSelectionFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'

const features = tableFeatures({ rowSelectionFeature })

export function SelectionCount({
  data,
  columns,
}: {
  data: Array<{ id: string }>
  columns: any[]
}) {
  const table = useTable({ features, data, columns }, (state) => ({
    rowSelection: state.rowSelection,
  }))
  return <output>{Object.keys(table.state.rowSelection).length}</output>
}
```

The optional selector controls which state changes rerender the component and which selected fields appear on `table.state`. Omitting it selects all registered slices.

## State patterns

### Subscribe at the expensive boundary

```tsx
function SelectedRows({
  table,
}: {
  table: ReturnType<typeof useTable<typeof features, { id: string }>>
}) {
  return (
    <table.Subscribe selector={(state) => state.rowSelection}>
      {(rowSelection) => <output>{Object.keys(rowSelection).length}</output>}
    </table.Subscribe>
  )
}
```

At a top-level component holding the adapter's table instance, `table.Subscribe` selects from `table.store`. Use this after measuring or when the React Compiler cannot see state reads hidden behind table builder methods.

### Control a slice with an external atom

```tsx
import { useCreateAtom } from '@tanstack/react-store'

const selection = useCreateAtom<Record<string, boolean>>({})
const table = useTable({
  features,
  columns,
  data,
  atoms: { rowSelection: selection },
})
```

An external atom is both ownership and subscription source; it avoids value-or-updater glue.

### Control a slice with React state

```tsx
const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
const table = useTable({
  features,
  columns,
  data,
  state: { rowSelection },
  onRowSelectionChange: setRowSelection,
})
```

## Common mistakes

### HIGH Treating a snapshot as subscription

Wrong:

```tsx
const count = Object.keys(table.atoms.rowSelection.get()).length
```

Correct:

```tsx
const count = Object.keys(table.state.rowSelection).length
```

`atoms.*.get()` and `table.store.state` return current values but do not subscribe a React render.

Source: `packages/react-table/src/useTable.ts`

### HIGH Supplying only the change callback

Wrong:

```tsx
const table = useTable({
  features,
  columns,
  data,
  onRowSelectionChange: setRowSelection,
})
```

Correct:

```tsx
const table = useTable({
  features,
  columns,
  data,
  state: { rowSelection },
  onRowSelectionChange: setRowSelection,
})
```

Once a callback takes ownership, the corresponding controlled value must be written back.

Source: `docs/framework/react/guide/table-state.md`

### HIGH Hiding builder reads from the React Compiler

Wrong:

```tsx
function SelectionCell({ row }) {
  return (
    <input
      type="checkbox"
      checked={row.getIsSelected()}
      onChange={row.getToggleSelectedHandler()}
    />
  )
}
```

Correct:

```tsx
import { Subscribe } from '@tanstack/react-table'

function SelectionCell({ row }) {
  return (
    <Subscribe
      source={row.table.atoms.rowSelection}
      selector={(selection) => selection[row.id]}
    >
      {(selected) => (
        <input
          type="checkbox"
          checked={!!selected}
          onChange={row.getToggleSelectedHandler()}
        />
      )}
    </Subscribe>
  )
}
```

With the default selector, `useTable` returns a fresh React-facing table reference on state changes. The remaining hazard is a nested component receiving only a stable core table, row, cell, column, or header object and hiding a state read behind one of its methods. Keep `Subscribe` inside that component, or pass its selected value to the child as a changing prop. An outer `Subscribe` that ignores the selected value is not enough.

Inside cell and header render contexts, `table` is typed as core `Table`, so import standalone `Subscribe`. Use `source={table.store}` with a selector for multiple slices, or a specific atom for the narrowest boundary.

Source: `docs/framework/react/guide/react-compiler.md`

### Choose boundaries after measuring

An extra subscription boundary:

```tsx
<table.Subscribe source={table.atoms.rowSelection}>
  {() => <Cell cell={cell} />}
</table.Subscribe>
```

With the default owner subscription, start with:

```tsx
<Cell cell={cell} />
```

Default `useTable` state selection is the simpler starting point; introduce fine-grained boundaries where measurement or compiler behavior justifies them.

Source: `docs/framework/react/guide/table-state.md`

## API discovery

Inspect `node_modules/@tanstack/react-table/dist/useTable.d.ts` and `Subscribe.d.ts`. Core atom precedence and state slices live under `node_modules/@tanstack/table-core/dist/`.

## Sources

- `TanStack/table:docs/framework/react/guide/table-state.md`
- `TanStack/table:docs/framework/react/guide/react-compiler.md`
- `TanStack/table:examples/react/basic-subscribe`
- `TanStack/table:packages/react-table/src/Subscribe.ts`
- `TanStack/table:packages/react-table/src/useTable.ts`
