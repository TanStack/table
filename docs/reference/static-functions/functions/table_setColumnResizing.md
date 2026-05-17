---
id: table_setColumnResizing
title: table_setColumnResizing
---

# Function: table\_setColumnResizing()

```ts
function table_setColumnResizing<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-resizing/columnResizingFeature.utils.ts:280](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.utils.ts#L280)

Routes a transient column resizing updater through the table's resize handler.

This state tracks the active drag interaction; committed widths live in
`columnSizing`.

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
table_setColumnResizing(table, (old) => ({ ...old, deltaOffset: 12 }))
```
