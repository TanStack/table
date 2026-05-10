---
id: table_setColumnOrder
title: table_setColumnOrder
---

# Function: table\_setColumnOrder()

```ts
function table_setColumnOrder<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-ordering/columnOrderingFeature.utils.ts:101](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts#L101)

Updates the table's column order state slice.

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

[`Updater`](../../index/type-aliases/Updater.md)\<[`ColumnOrderState`](../../index/type-aliases/ColumnOrderState.md)\>

## Returns

`void`

## Example

```ts
table_setColumnOrder(table, (old) => old)
```
