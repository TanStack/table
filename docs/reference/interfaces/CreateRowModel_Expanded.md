---
id: CreateRowModel_Expanded
title: CreateRowModel_Expanded
---

# Interface: CreateRowModel\_Expanded\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:124](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L124)

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

Defined in: [packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.types.ts#L131)

This function is responsible for returning the expanded row model. If this function is not provided, the table will not expand rows. You can use the default exported `getExpandedRowModel` function to get the expanded row model or implement your own.

#### Parameters

##### table

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>

#### Returns

```ts
(): RowModel<TFeatures, TData>;
```

##### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
