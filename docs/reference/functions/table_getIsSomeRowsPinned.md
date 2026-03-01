---
id: table_getIsSomeRowsPinned
title: table_getIsSomeRowsPinned
---

# Function: table\_getIsSomeRowsPinned()

```ts
function table_getIsSomeRowsPinned<TFeatures, TData>(table, position?): boolean;
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L45)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### position?

[`RowPinningPosition`](../type-aliases/RowPinningPosition.md)

## Returns

`boolean`
