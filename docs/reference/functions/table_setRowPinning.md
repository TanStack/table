---
id: table_setRowPinning
title: table_setRowPinning
---

# Function: table\_setRowPinning()

```ts
function table_setRowPinning<TFeatures, TData>(table, updater): void;
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L21)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../type-aliases/Updater.md)\<[`RowPinningState`](../interfaces/RowPinningState.md)\>

## Returns

`void`
