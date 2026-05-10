---
id: constructColumnPinningFeature
title: constructColumnPinningFeature
---

# Function: constructColumnPinningFeature()

```ts
function constructColumnPinningFeature<TFeatures, TData>(): TableFeature<ColumnPinningFeatureConstructors<TFeatures, TData>>;
```

Defined in: [features/column-pinning/columnPinningFeature.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.ts#L69)

Creates the stock column pinning feature.

The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`ColumnPinningFeatureConstructors`](../interfaces/ColumnPinningFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
