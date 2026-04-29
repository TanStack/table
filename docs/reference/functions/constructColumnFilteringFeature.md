---
id: constructColumnFilteringFeature
title: constructColumnFilteringFeature
---

# Function: constructColumnFilteringFeature()

```ts
function constructColumnFilteringFeature<TFeatures, TData>(): TableFeature<ColumnFilteringFeatureConstructors<TFeatures, TData>>;
```

Defined in: [features/column-filtering/columnFilteringFeature.ts:47](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.ts#L47)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`ColumnFilteringFeatureConstructors`](../interfaces/ColumnFilteringFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
