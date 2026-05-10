---
id: table_setColumnResizing
title: table_setColumnResizing
---

# Function: table\_setColumnResizing()

```ts
function table_setColumnResizing<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-resizing/columnResizingFeature.utils.ts:275](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts#L275)

Updates the table's column resizing state slice.

The updater follows TanStack Table updater semantics and is routed through the corresponding `on*Change` option or backing atom.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../../index/type-aliases/Updater.md)\<[`columnResizingState`](../../index/interfaces/columnResizingState.md)\>

## Returns

`void`

## Example

```ts
table_setColumnResizing(table, (old) => old)
```
