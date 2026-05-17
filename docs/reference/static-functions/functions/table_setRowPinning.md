---
id: table_setRowPinning
title: table_setRowPinning
---

# Function: table\_setRowPinning()

```ts
function table_setRowPinning<TFeatures, TData>(table, updater): void;
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:43](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L43)

Routes a row pinning updater through the table's row-pinning change handler.

The updater may be a next `{ top, bottom }` state or a function of the
previous state, matching the instance `table.setRowPinning` behavior.

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
table_setRowPinning(table, (old) => ({ ...old, top: [rowId] }))
```
