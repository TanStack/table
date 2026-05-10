---
id: table_setRowSelection
title: table_setRowSelection
---

# Function: table\_setRowSelection()

```ts
function table_setRowSelection<TFeatures, TData>(table, updater): void;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L35)

Updates the table's row selection state slice.

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

[`Updater`](../../index/type-aliases/Updater.md)\<[`RowSelectionState`](../../index/type-aliases/RowSelectionState.md)\>

## Returns

`void`

## Example

```ts
table_setRowSelection(table, (old) => old)
```
