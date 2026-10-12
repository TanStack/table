---
id: Table_RowModels_Expanded
title: Table_RowModels_Expanded
---

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:128](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L128)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getExpandedRowModel

```ts
getExpandedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:135](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L135)

Resolves the row model after expanded rows have been flattened into view.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getPreExpandedRowModel

```ts
getPreExpandedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:139](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L139)

Reads the row model immediately before expansion.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
