---
id: column_getFacetedMinMaxValues
title: column_getFacetedMinMaxValues
---

# Function: column\_getFacetedMinMaxValues()

```ts
function column_getFacetedMinMaxValues<TFeatures, TData, TValue>(column, table): [number, number] | undefined;
```

Defined in: [features/column-faceting/columnFacetingFeature.utils.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts#L18)

Computes min and max numeric facet values for one column.

The configured `facetedMinMaxValues` row-model factory owns the calculation.
If no factory is registered, the result is `undefined`.

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

\[`number`, `number`\] \| `undefined`

## Example

```ts
const range = column_getFacetedMinMaxValues(column, table)
```
