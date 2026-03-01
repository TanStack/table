---
id: table_setColumnFilters
title: table_setColumnFilters
---

# Function: table\_setColumnFilters()

```ts
function table_setColumnFilters<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:156](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L156)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### updater

[`Updater`](../type-aliases/Updater.md)\<[`ColumnFiltersState`](../type-aliases/ColumnFiltersState.md)\>

## Returns

`void`
