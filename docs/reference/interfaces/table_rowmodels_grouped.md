---
id: Table_RowModels_Grouped
title: Table_RowModels_Grouped
---

# Interface: Table\_RowModels\_Grouped\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getGroupedRowModel()

```ts
getGroupedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model for the table after grouping has been applied.

#### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:244](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L244)

***

### getPreGroupedRowModel()

```ts
getPreGroupedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model for the table before any grouping has been applied.

#### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getpregroupedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:250](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L250)
