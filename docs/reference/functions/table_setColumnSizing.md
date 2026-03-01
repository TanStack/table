---
id: table_setColumnSizing
title: table_setColumnSizing
---

# Function: table\_setColumnSizing()

```ts
function table_setColumnSizing<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:137](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L137)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnSizingState`](../type-aliases/ColumnSizingState.md)\>

## Returns

`void`
