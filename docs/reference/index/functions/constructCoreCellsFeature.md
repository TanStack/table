---
id: constructCoreCellsFeature
title: constructCoreCellsFeature
---

# Function: constructCoreCellsFeature()

```ts
function constructCoreCellsFeature<TFeatures, TData>(): TableFeature<CoreCellsFeatureConstructors<TFeatures, TData>>;
```

Defined in: [core/cells/coreCellsFeature.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.ts#L24)

Creates the stock core cells feature.

The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`CoreCellsFeatureConstructors`](../interfaces/CoreCellsFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
