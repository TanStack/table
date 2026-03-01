---
id: table_getIsSomeColumnsPinned
title: table_getIsSomeColumnsPinned
---

# Function: table\_getIsSomeColumnsPinned()

```ts
function table_getIsSomeColumnsPinned<TFeatures, TData>(table, position?): boolean;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:199](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L199)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### position?

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md)

## Returns

`boolean`
