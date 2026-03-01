---
id: column_getAfter
title: column_getAfter
---

# Function: column\_getAfter()

```ts
function column_getAfter<TFeatures, TData, TValue>(column, position): number;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L66)

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

### position

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md) | `"center"`

## Returns

`number`
