---
id: table_setPagination
title: table_setPagination
---

# Function: table\_setPagination()

```ts
function table_setPagination<TFeatures, TData>(table, updater): void | undefined;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L60)

Updates the table's pagination state slice.

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

[`Updater`](../../index/type-aliases/Updater.md)\<[`PaginationState`](../../index/interfaces/PaginationState.md)\>

## Returns

`void` \| `undefined`

## Example

```ts
table_setPagination(table, (old) => old)
```
