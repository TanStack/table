---
id: table_setSorting
title: table_setSorting
---

# Function: table\_setSorting()

```ts
function table_setSorting<TFeatures, TData>(table, updater): void;
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:39](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L39)

Updates the table's sorting state slice.

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

[`Updater`](../../index/type-aliases/Updater.md)\<[`SortingState`](../../index/type-aliases/SortingState.md)\>

## Returns

`void`

## Example

```ts
table_setSorting(table, (old) => old)
```
