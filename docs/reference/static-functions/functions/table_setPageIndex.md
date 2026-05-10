---
id: table_setPageIndex
title: table_setPageIndex
---

# Function: table\_setPageIndex()

```ts
function table_setPageIndex<TFeatures, TData>(table, updater): void;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:108](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L108)

Updates the table's page index state slice.

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

[`Updater`](../../index/type-aliases/Updater.md)\<`number`\>

## Returns

`void`

## Example

```ts
table_setPageIndex(table, (old) => old)
```
