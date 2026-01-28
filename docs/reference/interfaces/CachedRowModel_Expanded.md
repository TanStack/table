---
id: CachedRowModel_Expanded
title: CachedRowModel_Expanded
---

# Interface: CachedRowModel\_Expanded\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:136](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L136)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### expandedRowModel()

```ts
expandedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:140](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L140)

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
