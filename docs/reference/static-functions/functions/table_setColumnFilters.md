---
id: table_setColumnFilters
title: table_setColumnFilters
---

# Function: table\_setColumnFilters()

```ts
function table_setColumnFilters<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:245](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L245)

Updates the table's column filters state slice.

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

[`Updater`](../../index/type-aliases/Updater.md)\<[`ColumnFiltersState`](../../index/type-aliases/ColumnFiltersState.md)\>

## Returns

`void`

## Example

```ts
table_setColumnFilters(table, (old) => old)
```
