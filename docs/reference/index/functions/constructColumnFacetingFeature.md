---
id: constructColumnFacetingFeature
title: constructColumnFacetingFeature
---

# Function: constructColumnFacetingFeature()

```ts
function constructColumnFacetingFeature<TFeatures, TData>(): TableFeature<ColumnFacetingFeatureConstructors<TFeatures, TData>>;
```

Defined in: [features/column-faceting/columnFacetingFeature.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.ts#L37)

Creates the stock column faceting feature.

The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`ColumnFacetingFeatureConstructors`](../interfaces/ColumnFacetingFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
