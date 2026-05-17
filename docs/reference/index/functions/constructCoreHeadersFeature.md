---
id: constructCoreHeadersFeature
title: constructCoreHeadersFeature
---

# Function: constructCoreHeadersFeature()

```ts
function constructCoreHeadersFeature<TFeatures, TData>(): TableFeature<CoreHeadersFeatureConstructors<TFeatures, TData>>;
```

Defined in: [core/headers/coreHeadersFeature.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/coreHeadersFeature.ts#L27)

Creates the stock core headers feature.

The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`CoreHeadersFeatureConstructors`](../interfaces/CoreHeadersFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
