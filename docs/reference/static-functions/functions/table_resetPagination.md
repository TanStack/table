---
id: table_resetPagination
title: table_resetPagination
---

# Function: table\_resetPagination()

```ts
function table_resetPagination<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L91)

Resets `pagination` to the configured initial state or feature default.

With no argument, the reset clones `table.initialState.pagination` when it
exists. Passing `true` ignores initial state and resets to
`{ pageIndex: 0, pageSize: 10 }`.

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
