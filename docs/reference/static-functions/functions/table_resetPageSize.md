---
id: table_resetPageSize
title: table_resetPageSize
---

# Function: table\_resetPageSize()

```ts
function table_resetPageSize<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:165](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L165)

Resets the table's page size state slice.

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
table_resetPageSize(table)
table_resetPageSize(table, true)
```
