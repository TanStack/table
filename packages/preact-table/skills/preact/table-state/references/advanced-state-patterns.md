# Advanced state patterns — Preact

Extended state patterns extracted from `SKILL.md`. The three essential patterns (`useTable` selector, `<table.Subscribe>` walls, and external atoms via `useCreateAtom` + `options.atoms`) remain inline in the SKILL; this file covers the additional patterns.

## External state with `state` + `on*Change`

Classic Preact `useState` integration is still supported via `state` and matching `on[State]Change`. Useful for v8 migration paths or simple cases. Less fine-grained than external atoms.

```tsx
const [sorting, setSorting] = useState<SortingState>([])
const [pagination, setPagination] = useState<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = useTable({
  features,
  columns,
  data,
  state: { sorting, pagination },
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
})
```

Source: `docs/framework/preact/guide/table-state.md`.

## `createTableHook` for reusable shared config

When you ship the same `features` (including row model factories) and cell components across many tables, package them with `createTableHook`. You get `useAppTable`, `createAppColumnHelper`, `useTableContext` / `useCellContext` / `useHeaderContext`, and `table.AppTable` / `AppHeader` / `AppCell` / `AppFooter` boundaries.

```tsx
import {
  createTableHook,
  rowPaginationFeature,
  rowSortingFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  sortFns,
  tableFeatures,
} from '@tanstack/preact-table'

export const {
  useAppTable,
  createAppColumnHelper,
  useTableContext,
  useCellContext,
  useHeaderContext,
} = createTableHook({
  features: tableFeatures({
    rowPaginationFeature,
    rowSortingFeature,
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
    sortFns,
  }),
  tableComponents: { PaginationControls, RowCount },
  cellComponents: { TextCell, NumberCell },
  headerComponents: { SortIndicator },
})

const columnHelper = createAppColumnHelper<Person>()

function UsersTable({ data }: { data: Person[] }) {
  const table = useAppTable({ columns, data })

  return (
    <table.AppTable>
      <table>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((c) => (
                <table.AppCell cell={c} key={c.id}>
                  {(cell) => (
                    <td>
                      <cell.TextCell />
                    </td>
                  )}
                </table.AppCell>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <table.PaginationControls />
    </table.AppTable>
  )
}
```

Source: `docs/framework/preact/guide/create-table-hook.md`; `examples/preact/basic-use-app-table/src/main.tsx`; `packages/preact-table/src/createTableHook.tsx`.
