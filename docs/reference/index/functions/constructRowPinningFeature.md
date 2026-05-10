---
id: constructRowPinningFeature
title: constructRowPinningFeature
---

# Function: constructRowPinningFeature()

```ts
function constructRowPinningFeature<TFeatures, TData>(): TableFeature<RowPinningFeatureConstructors<TFeatures, TData>>;
```

Defined in: [features/row-pinning/rowPinningFeature.ts:43](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.ts#L43)

Creates the stock row pinning feature.

The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`RowPinningFeatureConstructors`](../interfaces/RowPinningFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
