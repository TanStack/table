---
id: constructRowSortingFeature
title: constructRowSortingFeature
---

# Function: constructRowSortingFeature()

```ts
function constructRowSortingFeature<TFeatures, TData>(): TableFeature<RowSortingFeatureConstructors<TFeatures, TData>>;
```

Defined in: [features/row-sorting/rowSortingFeature.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.ts#L55)

Creates the stock row sorting feature.

The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`RowSortingFeatureConstructors`](../interfaces/RowSortingFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
