---
id: column_getIsLastColumn
title: column_getIsLastColumn
---

# Function: column\_getIsLastColumn()

```ts
function column_getIsLastColumn<TFeatures, TData, TValue>(column, position?): boolean;
```

Defined in: [features/column-ordering/columnOrderingFeature.utils.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts#L38)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

### position?

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md) | `"center"`

## Returns

`boolean`
