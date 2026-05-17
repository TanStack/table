---
id: table_resetPageSize
title: table_resetPageSize
---

# Function: table\_resetPageSize()

```ts
function table_resetPageSize<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:175](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L175)

Resets only `pagination.pageSize`.

With no argument, the reset uses `table.initialState.pagination?.pageSize`
or `10`. Passing `true` always resets the page size to `10`.

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
table_resetPageSize(table)
table_resetPageSize(table, true)
```
