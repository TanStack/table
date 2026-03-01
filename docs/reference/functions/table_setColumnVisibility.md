---
id: table_setColumnVisibility
title: table_setColumnVisibility
---

# Function: table\_setColumnVisibility()

```ts
function table_setColumnVisibility<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:112](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L112)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnVisibilityState`](../type-aliases/ColumnVisibilityState.md)\>

## Returns

`void`
