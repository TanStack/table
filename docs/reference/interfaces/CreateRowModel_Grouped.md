---
id: CreateRowModel_Grouped
title: CreateRowModel_Grouped
---

# Interface: CreateRowModel\_Grouped\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:201](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L201)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### groupedRowModel()?

```ts
optional groupedRowModel: (table) => () => RowModel<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:208](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L208)

Returns the row model after grouping has taken place, but no further.

#### Parameters

##### table

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>

#### Returns

```ts
(): RowModel<TFeatures, TData>;
```

##### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
