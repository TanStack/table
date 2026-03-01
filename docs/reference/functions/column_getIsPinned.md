---
id: column_getIsPinned
title: column_getIsPinned
---

# Function: column\_getIsPinned()

```ts
function column_getIsPinned<TFeatures, TData, TValue>(column): ColumnPinningPosition;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L85)

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

## Returns

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md)
