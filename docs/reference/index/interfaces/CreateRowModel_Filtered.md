---
id: CreateRowModel_Filtered
title: CreateRowModel_Filtered
---

# Interface: CreateRowModel\_Filtered\<TFeatures, TData\>

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:212](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L212)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### filteredRowModel()?

```ts
optional filteredRowModel: (table) => () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:222](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L222)

If provided, this factory is called once per table and should return a
function that calculates the filtered row model.
- For server-side filtering, this function is unnecessary and can be ignored since the server should already return the filtered row model.
- For client-side filtering, pass the exported `createFilteredRowModel()` or implement your own factory.

#### Parameters

##### table

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>

#### Returns

```ts
(): RowModel<TFeatures, TData>;
```

##### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>
