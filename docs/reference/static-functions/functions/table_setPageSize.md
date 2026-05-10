---
id: table_setPageSize
title: table_setPageSize
---

# Function: table\_setPageSize()

```ts
function table_setPageSize<TFeatures, TData>(table, updater): void;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:188](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L188)

Updates the table's page size state slice.

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
table_setPageSize(table, (old) => old)
```
