---
id: table_setColumnPinning
title: table_setColumnPinning
---

# Function: table\_setColumnPinning()

```ts
function table_setColumnPinning<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:177](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L177)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnPinningState`](../interfaces/ColumnPinningState.md)\>

## Returns

`void`
