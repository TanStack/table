---
id: table_setColumnResizing
title: table_setColumnResizing
---

# Function: table\_setColumnResizing()

```ts
function table_setColumnResizing<TFeatures, TData>(table, updater): void;
```

Defined in: [packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts:216](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts#L216)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../type-aliases/Updater.md)\<[`columnResizingState`](../interfaces/columnResizingState.md)\>

## Returns

`void`
