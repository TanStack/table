---
id: constructCoreColumnsFeature
title: constructCoreColumnsFeature
---

# Function: constructCoreColumnsFeature()

```ts
function constructCoreColumnsFeature<TFeatures, TData>(): TableFeature<CoreColumnsFeatureConstructors<TFeatures, TData>>;
```

Defined in: [core/columns/coreColumnsFeature.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.ts#L35)

Creates the stock core columns feature.

The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`CoreColumnsFeatureConstructors`](../interfaces/CoreColumnsFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
