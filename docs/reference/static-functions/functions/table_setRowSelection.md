---
id: table_setRowSelection
title: table_setRowSelection
---

# Function: table\_setRowSelection()

```ts
function table_setRowSelection<TFeatures, TData>(table, updater): void;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L37)

Routes a row selection updater through the table's selection change handler.

The updater may be a next selection map or a function of the previous map,
matching the instance `table.setRowSelection` behavior.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../../index/type-aliases/Updater.md)\<[`RowSelectionState`](../../index/type-aliases/RowSelectionState.md)\>

## Returns

`void`

## Example

```ts
table_setRowSelection(table, (old) => ({ ...old, [rowId]: true }))
```
