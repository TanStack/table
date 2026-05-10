---
id: table_resetColumnOrder
title: table_resetColumnOrder
---

# Function: table\_resetColumnOrder()

```ts
function table_resetColumnOrder<TFeatures, TData>(table, defaultState?): void;
```

Defined in: [features/column-ordering/columnOrderingFeature.utils.ts:119](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts#L119)

Resets the table's column order state slice.

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
table_resetColumnOrder(table)
table_resetColumnOrder(table, true)
```
