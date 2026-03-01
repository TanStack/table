---
id: column_pin
title: column_pin
---

# Function: column\_pin()

```ts
function column_pin<TFeatures, TData, TValue>(column, position): void;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L31)

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

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md)

## Returns

`void`
