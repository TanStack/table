---
id: table_setGlobalFilter
title: table_setGlobalFilter
---

# Function: table\_setGlobalFilter()

```ts
function table_setGlobalFilter<TFeatures, TData>(table, updater): void;
```

Defined in: [features/global-filtering/globalFilteringFeature.utils.ts:84](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.utils.ts#L84)

Updates the table's global filter state slice.

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

`any`

## Returns

`void`

## Example

```ts
table_setGlobalFilter(table, (old) => old)
```
