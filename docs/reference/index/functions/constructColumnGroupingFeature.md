---
id: constructColumnGroupingFeature
title: constructColumnGroupingFeature
---

# Function: constructColumnGroupingFeature()

```ts
function constructColumnGroupingFeature<TFeatures, TData>(): TableFeature<ColumnGroupingFeatureConstructors<TFeatures, TData>>;
```

Defined in: [features/column-grouping/columnGroupingFeature.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.ts#L59)

Creates the stock column grouping feature.

The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`ColumnGroupingFeatureConstructors`](../interfaces/ColumnGroupingFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
