---
id: constructColumnSizingFeature
title: constructColumnSizingFeature
---

# Function: constructColumnSizingFeature()

```ts
function constructColumnSizingFeature<TFeatures, TData>(): TableFeature<ColumnSizingFeatureConstructors<TFeatures, TData>>;
```

Defined in: [features/column-sizing/columnSizingFeature.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.ts#L50)

Creates the stock column sizing feature.

The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`ColumnSizingFeatureConstructors`](../interfaces/ColumnSizingFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
