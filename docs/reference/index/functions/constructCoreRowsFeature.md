---
id: constructCoreRowsFeature
title: constructCoreRowsFeature
---

# Function: constructCoreRowsFeature()

```ts
function constructCoreRowsFeature<TFeatures, TData>(): TableFeature<CoreRowsFeatureConstructors<TFeatures, TData>>;
```

Defined in: [core/rows/coreRowsFeature.ts:36](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.ts#L36)

Creates the stock core rows feature.

The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`CoreRowsFeatureConstructors`](../interfaces/CoreRowsFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
