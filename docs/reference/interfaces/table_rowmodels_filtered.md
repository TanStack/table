---
id: Table_RowModels_Filtered
title: Table_RowModels_Filtered
---

# Interface: Table\_RowModels\_Filtered\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getFilteredRowModel()

```ts
getFilteredRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model for the table after **column** filtering has been applied.

#### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getfilteredrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:248](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L248)

***

### getPreFilteredRowModel()

```ts
getPreFilteredRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model for the table before any **column** filtering has been applied.

#### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getprefilteredrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:254](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L254)
