---
id: table_setGlobalFilter
title: table_setGlobalFilter
---

# Function: table\_setGlobalFilter()

```ts
function table_setGlobalFilter<TFeatures, TData>(table, updater): void;
```

Defined in: [features/global-filtering/globalFilteringFeature.utils.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.utils.ts#L89)

Routes a global filter updater through the table's global filter handler.

The updater may be a next value or a function of the previous value, matching
the instance `table.setGlobalFilter` behavior.

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
table_setGlobalFilter(table, 'search text')
```
