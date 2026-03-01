---
id: table_setRowSelection
title: table_setRowSelection
---

# Function: table\_setRowSelection()

```ts
function table_setRowSelection<TFeatures, TData>(table, updater): void;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:14](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L14)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../type-aliases/Updater.md)\<[`RowSelectionState`](../type-aliases/RowSelectionState.md)\>

## Returns

`void`
