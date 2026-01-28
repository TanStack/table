---
id: createTableHook
title: createTableHook
---

# Function: createTableHook()

```ts
function createTableHook<TFeatures, TTableComponents, TCellComponents, THeaderComponents>(__namedParameters): object;
```

Defined in: [createTableHook.tsx:590](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHook.tsx#L590)

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

### appFeatures

```ts
appFeatures: TFeatures;
```

### createAppColumnHelper()

```ts
createAppColumnHelper: <TData>() => AppColumnHelper<TFeatures, TData, TCellComponents, THeaderComponents>;
```

Create a column helper pre-bound to the features and components configured in this table hook.
The cell, header, and footer contexts include pre-bound components (e.g., `cell.TextCell`).

#### Type Parameters

##### TData

`TData` *extends* `RowData`

#### Returns

[`AppColumnHelper`](../type-aliases/AppColumnHelper.md)\<`TFeatures`, `TData`, `TCellComponents`, `THeaderComponents`\>

#### Example

```tsx
const columnHelper = createAppColumnHelper<Person>()

const columns = [
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: ({ cell }) => <cell.TextCell />, // cell has pre-bound components!
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    cell: ({ cell }) => <cell.NumberCell />,
  }),
]
```

### useAppTable()

```ts
useAppTable: <TData, TSelected>(tableOptions, selector?) => AppReactTable<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents>;
```

Enhanced useTable hook that returns a table with App wrapper components
and pre-bound tableComponents attached directly to the table object.

Default options from createTableHook are automatically merged with
the options passed here. Options passed here take precedence.

TFeatures is already known from the createTableHook call; TData is inferred from the data prop.

#### Type Parameters

##### TData

`TData` *extends* `RowData`

##### TSelected

`TSelected` = \{
\}

#### Parameters

##### tableOptions

`Omit`\<`TableOptions`\<`TFeatures`, `TData`\>, `"_features"` \| `"_rowModels"`\>

##### selector?

(`state`) => `TSelected`

#### Returns

[`AppReactTable`](../type-aliases/AppReactTable.md)\<`TFeatures`, `TData`, `TSelected`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

### useCellContext()

```ts
useCellContext: <TValue>() => Cell<TFeatures, any, TValue>;
```

Access the cell instance from within an `AppCell` wrapper.
Use this in custom `cellComponents` passed to `createTableHook`.
TFeatures is already known from the createTableHook call.

#### Type Parameters

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Returns

`Cell`\<`TFeatures`, `any`, `TValue`\>

#### Example

```tsx
function TextCell() {
  const cell = useCellContext<string>()
  return <span>{cell.getValue()}</span>
}

function NumberCell({ format }: { format?: Intl.NumberFormatOptions }) {
  const cell = useCellContext<number>()
  return <span>{cell.getValue().toLocaleString(undefined, format)}</span>
}
```

### useHeaderContext()

```ts
useHeaderContext: <TValue>() => Header<TFeatures, any, TValue>;
```

Access the header instance from within an `AppHeader` or `AppFooter` wrapper.
Use this in custom `headerComponents` passed to `createTableHook`.
TFeatures is already known from the createTableHook call.

#### Type Parameters

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Returns

`Header`\<`TFeatures`, `any`, `TValue`\>

#### Example

```tsx
function SortIndicator() {
  const header = useHeaderContext()
  const sorted = header.column.getIsSorted()
  return sorted === 'asc' ? '🔼' : sorted === 'desc' ? '🔽' : null
}

function ColumnFilter() {
  const header = useHeaderContext()
  if (!header.column.getCanFilter()) return null
  return (
    <input
      value={(header.column.getFilterValue() ?? '') as string}
      onChange={(e) => header.column.setFilterValue(e.target.value)}
      placeholder="Filter..."
    />
  )
}
```

### useTableContext()

```ts
useTableContext: <TData>() => ReactTable<TFeatures, TData>;
```

Access the table instance from within an `AppTable` wrapper.
Use this in custom `tableComponents` passed to `createTableHook`.
TFeatures is already known from the createTableHook call.

#### Type Parameters

##### TData

`TData` *extends* `RowData` = `RowData`

#### Returns

[`ReactTable`](../type-aliases/ReactTable.md)\<`TFeatures`, `TData`\>

#### Example

```tsx
function PaginationControls() {
  const table = useTableContext()
  return (
    <table.Subscribe selector={(s) => s.pagination}>
      {(pagination) => (
        <div>
          <button onClick={() => table.previousPage()}>Prev</button>
          <span>Page {pagination.pageIndex + 1}</span>
          <button onClick={() => table.nextPage()}>Next</button>
        </div>
      )}
    </table.Subscribe>
  )
}
```

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
  _features: tableFeatures({
    rowPaginationFeature,
    rowSortingFeature,
    columnFilteringFeature,
  }),
  _rowModels: {
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(sortFns),
    filteredRowModel: createFilteredRowModel(filterFns),
  },
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
