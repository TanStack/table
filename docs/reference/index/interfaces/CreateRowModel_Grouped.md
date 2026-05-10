---
id: CreateRowModel_Grouped
title: CreateRowModel_Grouped
---

# Interface: CreateRowModel\_Grouped\<TFeatures, TData\>

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:203](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L203)

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

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:212](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L212)

Factory used to retrieve the grouped row model. If using server-side
grouping, this is not required. To use client-side grouping, pass
`createGroupedRowModel()` or implement your own factory.

#### Parameters

##### table

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>

#### Returns

```ts
(): RowModel<TFeatures, TData>;
```

##### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
