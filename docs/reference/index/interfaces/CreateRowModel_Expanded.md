---
id: CreateRowModel_Expanded
title: CreateRowModel_Expanded
---

# Interface: CreateRowModel\_Expanded\<TFeatures, TData\>

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:128](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L128)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### expandedRowModel()?

```ts
optional expandedRowModel: (table) => () => RowModel<TFeatures, TData>;
```

Defined in: [features/row-expanding/rowExpandingFeature.types.ts:137](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L137)

Factory used to retrieve the expanded row model. If this function is not
provided, the table will not expand rows. To use client-side expansion,
pass `createExpandedRowModel()` or implement your own factory.

#### Parameters

##### table

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>

#### Returns

```ts
(): RowModel<TFeatures, TData>;
```

##### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
