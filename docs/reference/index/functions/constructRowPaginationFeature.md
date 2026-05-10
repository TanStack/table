---
id: constructRowPaginationFeature
title: constructRowPaginationFeature
---

# Function: constructRowPaginationFeature()

```ts
function constructRowPaginationFeature<TFeatures, TData>(): TableFeature<RowPaginationFeatureConstructors<TFeatures, TData>>;
```

Defined in: [features/row-pagination/rowPaginationFeature.ts:47](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.ts#L47)

Creates the stock row pagination feature.

The returned feature registers its state defaults, option defaults, and instance APIs so it can be included in a `tableFeatures({ ... })` call.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Returns

[`TableFeature`](../interfaces/TableFeature.md)\<[`RowPaginationFeatureConstructors`](../interfaces/RowPaginationFeatureConstructors.md)\<`TFeatures`, `TData`\>\>
