---
id: table_setColumnOrder
title: table_setColumnOrder
---

# Function: table\_setColumnOrder()

```ts
function table_setColumnOrder<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-ordering/columnOrderingFeature.utils.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts#L50)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnOrderState`](../type-aliases/ColumnOrderState.md)\>

## Returns

`void`
