---
id: Table_RowModels_Grouped
title: Table_RowModels_Grouped
---

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:143](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L143)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getGroupedRowModel

```ts
getGroupedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:150](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L150)

Resolves the row model after grouping has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getPreGroupedRowModel

```ts
getPreGroupedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:154](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L154)

Reads the row model immediately before grouping.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
