---
id: Table_RowModels_Expanded
title: Table_RowModels_Expanded
---

# Interface: Table\_RowModels\_Expanded\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getExpandedRowModel()

```ts
getExpandedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model after expansion has been applied.

#### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getexpandedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:159](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L159)

***

### getPreExpandedRowModel()

```ts
getPreExpandedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model before expansion has been applied.

#### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getpreexpandedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/expanding)

#### Defined in

[features/row-expanding/RowExpanding.types.ts:165](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.types.ts#L165)
