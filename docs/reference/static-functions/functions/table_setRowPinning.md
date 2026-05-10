---
id: table_setRowPinning
title: table_setRowPinning
---

# Function: table\_setRowPinning()

```ts
function table_setRowPinning<TFeatures, TData>(table, updater): void;
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L41)

Updates the table's row pinning state slice.

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

[`Updater`](../../index/type-aliases/Updater.md)\<[`RowPinningState`](../../index/interfaces/RowPinningState.md)\>

## Returns

`void`

## Example

```ts
table_setRowPinning(table, (old) => old)
```
