---
id: Table_RowModels_Expanded
title: Table_RowModels_Expanded
---

# Interface: Table\_RowModels\_Expanded\<TFeatures, TData\>

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:110](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L110)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getExpandedRowModel()

```ts
getExpandedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:117](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L117)

Returns the row model after expansion has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getPreExpandedRowModel()

```ts
getPreExpandedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:121](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L121)

Returns the row model before expansion has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
