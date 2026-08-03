---
id: createTableHook
title: createTableHook
---

# Function: createTableHook()

```ts
function createTableHook<TFeatures, TTableComponents, TCellComponents, THeaderComponents>(__namedParameters): CreateTableHookResult<TFeatures, TTableComponents, TCellComponents, THeaderComponents>;
```

Defined in: [packages/svelte-table/src/createTableHook.svelte.ts:487](https://github.com/TanStack/table/blob/main/packages/svelte-table/src/createTableHook.svelte.ts#L487)

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
