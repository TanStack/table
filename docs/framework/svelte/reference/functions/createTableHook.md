---
id: createTableHook
title: createTableHook
---

# Function: createTableHook()

```ts
function createTableHook<TFeatures, TTableComponents, TCellComponents, THeaderComponents>(__namedParameters): object;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:419](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L419)

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

### createAppTable()

```ts
createAppTable: <TData, TSelected>(tableOptions, selector?) => AppSvelteTable<TFeatures, TData, TSelected, TTableComponents, TCellComponents, THeaderComponents>;
```

Enhanced createTable hook that returns a table with App wrapper components
and pre-bound tableComponents attached directly to the table object.

Default options from createTableHook are automatically merged with
the options passed here. Options passed here take precedence.

TFeatures is already known from the createTableHook call; TData is inferred from the data prop.

#### Type Parameters

##### TData

`TData` *extends* `RowData`

##### TSelected

`TSelected` = `TableState`\<`TFeatures`\>

#### Parameters

##### tableOptions

`Omit`\<`TableOptions`\<`TFeatures`, `TData`\>, `"features"`\>

##### selector?

(`state`) => `TSelected`

#### Returns

[`AppSvelteTable`](../type-aliases/AppSvelteTable.md)\<`TFeatures`, `TData`, `TSelected`, `TTableComponents`, `TCellComponents`, `THeaderComponents`\>

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

### useTableContext()

```ts
useTableContext: <TData>() => SvelteTable<TFeatures, TData>;
```

Access the table instance from within an `AppTable` wrapper.
Use this in custom `tableComponents` passed to `createTableHook`.
TFeatures is already known from the createTableHook call.

#### Type Parameters

##### TData

`TData` *extends* `RowData` = `RowData`

#### Returns

[`SvelteTable`](../type-aliases/SvelteTable.md)\<`TFeatures`, `TData`\>

## Example

```ts
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
```
