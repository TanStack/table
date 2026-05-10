---
id: table_resetSorting
title: table_resetSorting
---

# Function: table\_resetSorting()

```ts
function table_resetSorting<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:57](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L57)

Resets the table's sorting state slice.

By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### defaultState?

`boolean`

## Returns

`void`

## Example

```ts
table_resetSorting(table)
table_resetSorting(table, true)
```
