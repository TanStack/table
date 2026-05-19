---
id: table_setColumnFilters
title: table_setColumnFilters
---

# Function: table\_setColumnFilters()

```ts
function table_setColumnFilters<TFeatures, TData>(table, updater): void;
```

Defined in: [features/column-filtering/columnFilteringFeature.utils.ts:255](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.utils.ts#L255)

Routes a column filter updater through the table's filter change handler.

The resolved filters are cleaned before they are emitted: filters for known
columns are removed when their filter function says the value should be
auto-removed.

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
table_setColumnFilters(table, (old) => old.filter((filter) => filter.id !== 'age'))
```
