---
id: createTableHook
title: createTableHook
---

# Function: createTableHook()

```ts
function createTableHook<TFeatures, TTableComponents, TCellComponents, THeaderComponents>(__namedParameters): CreateTableHookResult<TFeatures, TTableComponents, TCellComponents, THeaderComponents>;
```

Defined in: [packages/lit-table/src/createTableHook.ts:504](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L504)

Creates a custom table hook with pre-bound components for composition.

This is the table equivalent of TanStack Form's `createFormHook`. It allows you to:
- Define features, row models, and default options once, shared across all tables
- Register reusable table, cell, and header components
- Access table/cell/header instances via `@lit/context` in those components
- Get a `useAppTable` hook that returns an extended table with App wrapper functions
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

```ts
// hooks/table.ts
export const {
  createAppColumnHelper,
  useAppTable,
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

// my-table.ts
@customElement('my-table')
class MyTable extends LitElement {
  private appTable = useAppTable(this, {
    columns,
    data: this.data,
  })

  protected render() {
    const table = this.appTable.table()

    return html`
      <table>
        <thead>
          ${repeat(table.getHeaderGroups(), (hg) => hg.id, (hg) => html`
            <tr>
              ${hg.headers.map((h) => table.AppHeader(h, (header) => html`
                <th>${header.FlexRender()}</th>
              `))}
            </tr>
          `)}
        </thead>
        <tbody>
          ${table.getRowModel().rows.map((row) => html`
            <tr>
              ${row.getAllCells().map((c) => table.AppCell(c, (cell) => html`
                <td>${cell.FlexRender()}</td>
              `))}
            </tr>
          `)}
        </tbody>
      </table>
    `
  }
}
```
