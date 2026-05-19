---
id: table_resetPageIndex
title: table_resetPageIndex
---

# Function: table\_resetPageIndex()

```ts
function table_resetPageIndex<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:150](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L150)

Resets only `pagination.pageIndex`.

With no argument, the reset uses `table.initialState.pagination?.pageIndex`
or `0`. Passing `true` always resets the page index to `0`.

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
table_resetPageIndex(table)
table_resetPageIndex(table, true)
```
