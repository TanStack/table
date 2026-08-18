---
id: createTableHook
title: createTableHook
---

# Function: createTableHook()

```ts
function createTableHook<TFeatures, TTableComponents, TCellComponents, THeaderComponents>(__namedParameters): CreateTableHookResult<TFeatures, TTableComponents, TCellComponents, THeaderComponents>;
```

Defined in: [createTableHook.tsx:692](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L692)

Creates a custom table hook with pre-bound components for composition.

This is the table equivalent of TanStack Form's `createFormHook`. It allows you to:
- Define features, row models, and default options once, shared across all tables
- Register reusable table, cell, and header components
- Access table/cell/header instances via context in those components
- Get a `useAppTable` hook that returns an extended table with App wrapper components
- Get a `createAppColumnHelper` function pre-bound to your features

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TTableComponents

`TTableComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

## Parameters

### \_\_namedParameters

[`CreateTableHookOptions`](../type-aliases/CreateTableHookOptions.md)\<`TFeatures`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

## Returns

[`CreateTableHookResult`](../interfaces/CreateTableHookResult.md)\<`TFeatures`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

## Example

```tsx
// hooks/table.ts
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
    columnFilteringFeature,
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
    filteredRowModel: createFilteredRowModel(),
    sortFns,
    filterFns,
  }),
  tableComponents: { PaginationControls, RowCount },
  cellComponents: { TextCell, NumberCell },
  headerComponents: { SortIndicator, ColumnFilter },
})

// Create column helper with TFeatures already bound
const columnHelper = createAppColumnHelper<Person>()

// components/table-components.tsx
function PaginationControls() {
  const table = useTableContext() // TFeatures already known!
  return <table.Subscribe selector={(s) => s.pagination}>...</table.Subscribe>
}

// features/users.tsx
function UsersTable({ data }: { data: Person[] }) {
  const table = useAppTable({
    columns,
    data, // TData inferred from Person[]
  })

  return (
    <table.AppTable>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(h => (
                <table.AppHeader header={h} key={h.id}>
                  {(header) => (
                    <th>
                      <table.FlexRender header={h} />
                      <header.SortIndicator />
                    </th>
                  )}
                </table.AppHeader>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getAllCells().map(c => (
                <table.AppCell cell={c} key={c.id}>
                  {(cell) => <td><cell.TextCell /></td>}
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
