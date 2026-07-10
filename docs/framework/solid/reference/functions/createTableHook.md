---
id: createTableHook
title: createTableHook
---

# Function: createTableHook()

```ts
function createTableHook<TFeatures, TTableComponents, TCellComponents, THeaderComponents>(__namedParameters): CreateTableHookResult<TFeatures, TTableComponents, TCellComponents, THeaderComponents>;
```

Defined in: [createTableHook.tsx:572](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTableHook.tsx#L572)

Creates a custom table hook with pre-bound components for composition.

This is the table equivalent of TanStack Form's `createFormHook`. It allows you to:
- Define features, row models, and default options once, shared across all tables
- Register reusable table, cell, and header components
- Access table/cell/header instances via context in those components
- Get a `createAppTable` hook that returns an extended table with App wrapper components
- Get a `createAppColumnHelper` function pre-bound to your features

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TTableComponents

`TTableComponents` *extends* `Record`\<`string`, [`ComponentType`](../type-aliases/ComponentType.md)\<`any`\>\>

### TCellComponents

`TCellComponents` *extends* `Record`\<`string`, [`ComponentType`](../type-aliases/ComponentType.md)\<`any`\>\>

### THeaderComponents

`THeaderComponents` *extends* `Record`\<`string`, [`ComponentType`](../type-aliases/ComponentType.md)\<`any`\>\>

## Parameters

### \_\_namedParameters

[`CreateTableHookOptions`](../type-aliases/CreateTableHookOptions.md)\<`TFeatures`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

## Returns

[`CreateTableHookResult`](../interfaces/CreateTableHookResult.md)\<`TFeatures`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

## Example

```tsx
// hooks/table.ts
export const {
  createAppTable,
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
  return (
    <table.Subscribe>
      {(atoms) => <span>Page {atoms.pagination.get().pageIndex + 1}</span>}
    </table.Subscribe>
  )
}

// features/users.tsx
function UsersTable({ data }: { data: Person[] }) {
  const table = createAppTable({
    columns,
    data, // TData inferred from Person[]
  })

  return (
    <table.AppTable>
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(h) => (
                    <table.AppHeader header={h}>
                      {(header) => (
                        <th>
                          <header.FlexRender />
                          <header.SortIndicator />
                        </th>
                      )}
                    </table.AppHeader>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.getRowModel().rows}>
            {(row) => (
              <tr>
                <For each={row.getAllCells()}>
                  {(c) => (
                    <table.AppCell cell={c}>
                      {(cell) => <td><cell.TextCell /></td>}
                    </table.AppCell>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      <table.PaginationControls />
    </table.AppTable>
  )
}
```
