---
id: table_getGlobalFacetedMinMaxValues
title: table_getGlobalFacetedMinMaxValues
---

# Function: table\_getGlobalFacetedMinMaxValues()

```ts
function table_getGlobalFacetedMinMaxValues<TFeatures, TData>(table): [number, number] | undefined;
```

Defined in: [features/column-faceting/columnFacetingFeature.utils.ts:94](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts#L94)

Computes min and max numeric facet values for the global filter context.

The global context is requested with the internal `__global__` column id. If
no factory is registered, the result is `undefined`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

\[`number`, `number`\] \| `undefined`

## Example

```ts
const range = table_getGlobalFacetedMinMaxValues(table)
```
