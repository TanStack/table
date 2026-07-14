---
id: Table_RowModels_Grouped
title: Table_RowModels_Grouped
---

# Interface: Table\_RowModels\_Grouped\<TFeatures, TData\>

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:133](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L133)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getGroupedRowModel()

```ts
getGroupedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:140](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L140)

Resolves the row model after grouping has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getPreGroupedRowModel()

```ts
getPreGroupedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:144](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L144)

Reads the row model immediately before grouping.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
