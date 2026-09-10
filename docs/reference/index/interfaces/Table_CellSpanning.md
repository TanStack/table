---
id: Table_CellSpanning
title: Table_CellSpanning
---

# Interface: Table\_CellSpanning\<TFeatures, TData\>

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:166](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L166)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getCellSpanIndex()

```ts
getCellSpanIndex: () => CellSpanIndex<TFeatures, TData>;
```

Defined in: [features/cell-spanning/cellSpanningFeature.types.ts:173](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.types.ts#L173)

The memoized span index for the rows that are currently rendered.

#### Returns

[`CellSpanIndex`](CellSpanIndex.md)\<`TFeatures`, `TData`\>
