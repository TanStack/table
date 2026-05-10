---
id: constructGlobalFilteringFeature
title: constructGlobalFilteringFeature
---

# Function: constructGlobalFilteringFeature()

```ts
function constructGlobalFilteringFeature<TFeatures, TData>(): TableFeature<GlobalFilteringFeatureConstructors<TFeatures, TData>>;
```

Defined in: [features/global-filtering/globalFilteringFeature.ts:39](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/global-filtering/globalFilteringFeature.ts#L39)

Creates the stock global filtering feature.

The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`GlobalFilteringFeatureConstructors`](../interfaces/GlobalFilteringFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
