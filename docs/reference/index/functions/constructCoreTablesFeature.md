---
id: constructCoreTablesFeature
title: constructCoreTablesFeature
---

# Function: constructCoreTablesFeature()

```ts
function constructCoreTablesFeature<TFeatures, TData>(): TableFeature<CoreTablesFeatureConstructors<TFeatures, TData>>;
```

Defined in: [core/table/coreTablesFeature.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/table/coreTablesFeature.ts#L20)

Creates the stock core tables feature.

The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`CoreTablesFeatureConstructors`](../interfaces/CoreTablesFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
