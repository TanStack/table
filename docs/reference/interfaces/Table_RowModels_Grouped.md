---
id: Table_RowModels_Grouped
title: Table_RowModels_Grouped
---

# Interface: Table\_RowModels\_Grouped\<TFeatures, TData\>

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:187](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L187)

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

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:194](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L194)

Returns the row model for the table after grouping has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getPreGroupedRowModel()

```ts
getPreGroupedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:198](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L198)

Returns the row model for the table before any grouping has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
