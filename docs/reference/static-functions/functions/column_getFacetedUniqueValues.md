---
id: column_getFacetedUniqueValues
title: column_getFacetedUniqueValues
---

# Function: column\_getFacetedUniqueValues()

```ts
function column_getFacetedUniqueValues<TFeatures, TData, TValue>(column, table): Map<any, number>;
```

Defined in: [features/column-faceting/columnFacetingFeature.utils.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts#L69)

Computes unique facet values and their occurrence counts for one column.

The configured `facetedUniqueValues` row-model factory owns the calculation.
If no factory is registered, an empty `Map` is returned.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`Map`\<`any`, `number`\>

## Example

```ts
const values = column_getFacetedUniqueValues(column, table)
```
