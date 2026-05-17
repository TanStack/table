---
id: table_getGlobalFacetedUniqueValues
title: table_getGlobalFacetedUniqueValues
---

# Function: table\_getGlobalFacetedUniqueValues()

```ts
function table_getGlobalFacetedUniqueValues<TFeatures, TData>(table): Map<any, number>;
```

Defined in: [features/column-faceting/columnFacetingFeature.utils.ts:137](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.utils.ts#L137)

Computes unique values and occurrence counts for the global filter context.

The global context is requested with the internal `__global__` column id. If
no factory is registered, an empty `Map` is returned.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`Map`\<`any`, `number`\>

## Example

```ts
const values = table_getGlobalFacetedUniqueValues(table)
```
