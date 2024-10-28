---
id: CachedRowModel_Filtered
title: CachedRowModel_Filtered
---

# Interface: CachedRowModel\_Filtered\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### filteredRowModel()

```ts
filteredRowModel: () => RowModel<TFeatures, TData>;
```

#### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:277](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L277)
