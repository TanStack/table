---
id: constructColumnResizingFeature
title: constructColumnResizingFeature
---

# Function: constructColumnResizingFeature()

```ts
function constructColumnResizingFeature<TFeatures, TData>(): TableFeature<ColumnResizingFeatureConstructors<TFeatures, TData>>;
```

Defined in: [features/column-resizing/columnResizingFeature.ts:40](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-resizing/columnResizingFeature.ts#L40)

Creates the stock column resizing feature.

The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`ColumnResizingFeatureConstructors`](../interfaces/ColumnResizingFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
