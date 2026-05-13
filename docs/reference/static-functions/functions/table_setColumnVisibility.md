---
id: table_setColumnVisibility
title: table_setColumnVisibility
---

# Function: table\_setColumnVisibility()

```ts
function table_setColumnVisibility<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:231](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L231)

Updates the table's column visibility state slice.

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

[`Updater`](../../index/type-aliases/Updater.md)\<[`ColumnVisibilityState`](../../index/type-aliases/ColumnVisibilityState.md)\>

## Returns

`void`

## Example

```ts
table_setColumnVisibility(table, (old) => old)
```
