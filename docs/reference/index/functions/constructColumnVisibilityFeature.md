---
id: constructColumnVisibilityFeature
title: constructColumnVisibilityFeature
---

# Function: constructColumnVisibilityFeature()

```ts
function constructColumnVisibilityFeature<TFeatures, TData>(): TableFeature<ColumnVisibilityFeatureConstructors<TFeatures, TData>>;
```

Defined in: [features/column-visibility/columnVisibilityFeature.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.ts#L56)

Creates the stock column visibility feature.

The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`ColumnVisibilityFeatureConstructors`](../interfaces/ColumnVisibilityFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
