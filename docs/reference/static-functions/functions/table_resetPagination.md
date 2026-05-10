---
id: table_resetPagination
title: table_resetPagination
---

# Function: table\_resetPagination()

```ts
function table_resetPagination<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:84](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L84)

Resets the table's pagination state slice.

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
table_resetPagination(table)
table_resetPagination(table, true)
```
