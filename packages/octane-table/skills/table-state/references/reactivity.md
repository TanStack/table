# Octane Table reactivity

Read for Octane subscription boundaries, shared state, or updates that require more than the default rendering behavior.

This reference inherits the version of its owning skill.

## Mount independent subscription islands

```tsrx
import { rowSelectionFeature, tableFeatures, useTable } from '@tanstack/octane-table'

const features = tableFeatures({ rowSelectionFeature })
const columns = [{ accessorKey: 'name' }]
const data = [{ name: 'Ada' }]

function SelectionCount() @{
  const table = useTable({ features, columns, data }, () => null)
  <table.Subscribe source={table.atoms.rowSelection}>
    {(selection) => <output>{String(Object.keys(selection).length)}</output>}
  </table.Subscribe>
  <button onClick={() => table.toggleAllRowsSelected()}>Toggle all</button>
}
```

Without `source`, `table.Subscribe` subscribes to `table.store` and needs a selector. With `source`, it can consume one atom or store. If the owner selects `null`, every UI region must subscribe to the slices its Table API reads depend on, including row-model dependencies.

Always mount `Subscribe` with JSX. `table.Subscribe({ source, children })` shares the owner's compiler slots and loses the independent hook scope.

## Share a synchronous external owner

```tsrx
import { useCreateAtom } from '@tanstack/octane-store'
import { rowPaginationFeature, tableFeatures, useTable } from '@tanstack/octane-table'

const features = tableFeatures({ rowPaginationFeature })
const columns = [{ accessorKey: 'name' }]
const data = [{ name: 'Ada' }]

function PageStatus() @{
  const pagination = useCreateAtom({ pageIndex: 0, pageSize: 20 })
  const table = useTable({ features, columns, data, atoms: { pagination } })
  <button onClick={() => table.nextPage()}>
    Page {String(table.state.pagination.pageIndex + 1)}
  </button>
}
```

Use `useSelector` from `@tanstack/octane-store` when another component consumes the atom. External atoms are direct synchronous owners and take precedence over `options.state`; omit the matching controlled callback.

## Render and commit timing

`useTable` stages current data, columns, callbacks, and controlled state for same-render reads. It publishes controlled state only after Octane accepts the render, from the layout commit. Suspended or abandoned renders cannot publish speculative state.

The owner drops the matching redundant post-commit notification because it already rendered that snapshot. Independently mounted `table.Subscribe` consumers still receive the update before paint. This distinction applies to controlled `state`; external atom writes remain synchronous.

For controlled state, pass `state.<slice>` together with the corresponding Octane setter. A custom callback must resolve raw values and updater functions before feeding the owner back into Table.

## API discovery

Inspect `node_modules/@tanstack/octane-table/src/index.d.ts`, the matching `*.tsrx.d.ts` sidecar, and `src/types.ts`. This package publishes authored source; core APIs are in installed `@tanstack/table-core/dist/`.

## Sources

- `TanStack/table:docs/framework/octane/guide/table-state.md`
- `TanStack/table:examples/octane/basic-subscribe`
- `TanStack/table:examples/octane/basic-external-atoms`
- `TanStack/table:packages/octane-table/src/useTable.tsrx`
- `TanStack/table:packages/octane-table/src/Subscribe.tsrx`
