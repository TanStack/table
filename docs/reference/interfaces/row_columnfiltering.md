---
id: Row_ColumnFiltering
title: Row_ColumnFiltering
---

# Interface: Row\_ColumnFiltering\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### columnFilters

```ts
columnFilters: Record<string, boolean>;
```

The column filters map for the row. This object tracks whether a row is passing/failing specific filters by their column ID.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#columnfilters)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:148](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L148)

***

### columnFiltersMeta

```ts
columnFiltersMeta: Record<string, FilterMeta>;
```

The column filters meta map for the row. This object tracks any filter meta for a row as optionally provided during the filtering process.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#columnfiltersmeta)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

#### Defined in

[features/column-filtering/ColumnFiltering.types.ts:154](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-filtering/ColumnFiltering.types.ts#L154)
