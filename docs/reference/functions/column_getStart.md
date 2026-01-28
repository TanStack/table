---
id: column_getStart
title: column_getStart
---

# Function: column\_getStart()

```ts
function column_getStart<TFeatures, TData, TValue>(column, position): number;
```

Defined in: [packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L46)

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
