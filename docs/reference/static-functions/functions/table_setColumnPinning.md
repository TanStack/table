---
id: table_setColumnPinning
title: table_setColumnPinning
---

# Function: table\_setColumnPinning()

```ts
function table_setColumnPinning<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:267](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L267)

Updates the table's column pinning state slice.

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

[`Updater`](../../index/type-aliases/Updater.md)\<[`ColumnPinningState`](../../index/interfaces/ColumnPinningState.md)\>

## Returns

`void`

## Example

```ts
table_setColumnPinning(table, (old) => old)
```
