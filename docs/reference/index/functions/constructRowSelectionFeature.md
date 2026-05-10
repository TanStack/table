---
id: constructRowSelectionFeature
title: constructRowSelectionFeature
---

# Function: constructRowSelectionFeature()

```ts
function constructRowSelectionFeature<TFeatures, TData>(): TableFeature<RowSelectionFeatureConstructors<TFeatures, TData>>;
```

Defined in: [features/row-selection/rowSelectionFeature.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.ts#L55)

Creates the stock row selection feature.

The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`RowSelectionFeatureConstructors`](../interfaces/RowSelectionFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
