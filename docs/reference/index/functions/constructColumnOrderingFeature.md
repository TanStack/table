---
id: constructColumnOrderingFeature
title: constructColumnOrderingFeature
---

# Function: constructColumnOrderingFeature()

```ts
function constructColumnOrderingFeature<TFeatures, TData>(): TableFeature<ColumnOrderingFeatureConstructors<TFeatures, TData>>;
```

Defined in: [features/column-ordering/columnOrderingFeature.ts:39](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.ts#L39)

Creates the stock column ordering feature.

The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`ColumnOrderingFeatureConstructors`](../interfaces/ColumnOrderingFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
