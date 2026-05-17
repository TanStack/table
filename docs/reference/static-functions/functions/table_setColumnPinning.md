---
id: table_setColumnPinning
title: table_setColumnPinning
---

# Function: table\_setColumnPinning()

```ts
function table_setColumnPinning<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:289](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L289)

Routes a column pinning updater through the table's pinning change handler.

The updater may be a next `{ left, right }` state or a function of the
previous state, matching the instance `table.setColumnPinning` behavior.

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
table_setColumnPinning(table, (old) => ({ ...old, left: ['select'] }))
```
