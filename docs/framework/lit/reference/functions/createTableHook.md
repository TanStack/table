---
id: createTableHook
title: createTableHook
---

# Function: createTableHook()

```ts
function createTableHook<TFeatures, TTableComponents, TCellComponents, THeaderComponents>(__namedParameters): object;
```

Defined in: [createTableHook.ts:427](https://github.com/TanStack/table/blob/main/packages/lit-table/src/createTableHook.ts#L427)

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

```ts
const columnHelper = createAppColumnHelper<Person>()

const columns = [
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: ({ cell }) => cell.FlexRender(), // cell has pre-bound components!
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    cell: ({ cell }) => cell.NumberCell(),
  }),
]
```

### useAppTable()

```ts
useAppTable: <TData, TSelected>(host, tableOptions, selector?) => object;
```

Enhanced table hook that returns a controller-like object with a `table()` method.
The returned table has App wrapper functions and pre-bound tableComponents
attached directly to the table object.

Default options from createTableHook are automatically merged with
the options passed here. Options passed here take precedence.

TFeatures is already known from the createTableHook call; TData is inferred from the data prop.

#### Type Parameters

##### TData

`TData` *extends* `RowData`

##### TSelected

`TSelected` = `TableState`\<`TFeatures`\>

#### Parameters

##### host

`ReactiveControllerHost` & `HTMLElement`

##### tableOptions

`Omit`\<`TableOptions`\<`TFeatures`, `TData`\>, `"features"`\>

##### selector?

(`state`) => `TSelected`

#### Returns

`object`

##### table()

```ts
table: () => AppLitTable<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents>;
```

###### Returns

[`AppLitTable`](../type-aliases/AppLitTable.md)\<`TFeatures`, `TData`, `TSelected`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

#### Example

```ts
@customElement('my-table')
class MyTable extends LitElement {
  private appTable = useAppTable(this, {
    columns,
    data: this.data,
  })

  protected render() {
    const table = this.appTable.table()
    return html`...`
  }
}
```

### useCellContext()

```ts
useCellContext: <TValue>(host) => ContextConsumer<Context<symbol, Cell<TFeatures, any, TValue>>, ReactiveControllerHost & HTMLElement>;
```

Access the cell instance from within a custom element that is a descendant
of an element providing cell context.
Uses `@lit/context` ContextConsumer to retrieve the cell.
TFeatures is already known from the createTableHook call.

#### Type Parameters

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Parameters

##### host

`ReactiveControllerHost` & `HTMLElement`

#### Returns

`ContextConsumer`\<`Context`\<`symbol`, `Cell`\<`TFeatures`, `any`, `TValue`\>\>, `ReactiveControllerHost` & `HTMLElement`\>

#### Example

```ts
@customElement('text-cell')
class TextCell extends LitElement {
  private _cell = useCellContext(this)

  protected render() {
    const cell = this._cell.value
    if (!cell) return html``
    return html`<span>${cell.getValue()}</span>`
  }
}
```

### useHeaderContext()

```ts
useHeaderContext: <TValue>(host) => ContextConsumer<Context<symbol, Header<TFeatures, any, TValue>>, ReactiveControllerHost & HTMLElement>;
```

Access the header instance from within a custom element that is a descendant
of an element providing header context.
Uses `@lit/context` ContextConsumer to retrieve the header.
TFeatures is already known from the createTableHook call.

#### Type Parameters

##### TValue

`TValue` *extends* `unknown` = `unknown`

#### Parameters

##### host

`ReactiveControllerHost` & `HTMLElement`

#### Returns

`ContextConsumer`\<`Context`\<`symbol`, `Header`\<`TFeatures`, `any`, `TValue`\>\>, `ReactiveControllerHost` & `HTMLElement`\>

#### Example

```ts
@customElement('sort-indicator')
class SortIndicator extends LitElement {
  private _header = useHeaderContext(this)

  protected render() {
    const header = this._header.value
    if (!header) return html``
    const sorted = header.column.getIsSorted()
    return html`${sorted === 'asc' ? '🔼' : sorted === 'desc' ? '🔽' : ''}`
  }
}
```

### useTableContext()

```ts
useTableContext: <TData>(host) => ContextConsumer<Context<symbol, LitTable<TFeatures, TData, any>>, ReactiveControllerHost & HTMLElement>;
```

Access the table instance from within a custom element that is a descendant
of the element using `useAppTable`.
Uses `@lit/context` ContextConsumer to retrieve the table from the nearest ancestor provider.
TFeatures is already known from the createTableHook call.

#### Type Parameters

##### TData

`TData` *extends* `RowData` = `RowData`

#### Parameters

##### host

`ReactiveControllerHost` & `HTMLElement`

#### Returns

`ContextConsumer`\<`Context`\<`symbol`, [`LitTable`](../type-aliases/LitTable.md)\<`TFeatures`, `TData`, `any`\>\>, `ReactiveControllerHost` & `HTMLElement`\>

#### Example

```ts
@customElement('pagination-controls')
class PaginationControls extends LitElement {
  private _table = useTableContext(this)

  protected render() {
    const table = this._table.value
    if (!table) return html``
    return html`
      <button @click=${() => table.previousPage()}>Prev</button>
      <button @click=${() => table.nextPage()}>Next</button>
    `
  }
}
```

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
