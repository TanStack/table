---
id: table_setColumnSizing
title: table_setColumnSizing
---

# Function: table\_setColumnSizing()

```ts
function table_setColumnSizing<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:245](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L245)

Updates the table's column sizing state slice.

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

[`Updater`](../../index/type-aliases/Updater.md)\<[`ColumnSizingState`](../../index/type-aliases/ColumnSizingState.md)\>

## Returns

`void`

## Example

```ts
table_setColumnSizing(table, (old) => old)
```
