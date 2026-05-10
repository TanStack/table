---
id: constructRowExpandingFeature
title: constructRowExpandingFeature
---

# Function: constructRowExpandingFeature()

```ts
function constructRowExpandingFeature<TFeatures, TData>(): TableFeature<RowExpandingFeatureConstructors<TFeatures, TData>>;
```

Defined in: [features/row-expanding/rowExpandingFeature.ts:51](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.ts#L51)

Creates the stock row expanding feature.

The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`RowExpandingFeatureConstructors`](../interfaces/RowExpandingFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
