---
id: Column_ColumnFaceting
title: Column_ColumnFaceting
---

# Interface: Column\_ColumnFaceting\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getFacetedMinMaxValues()

```ts
getFacetedMinMaxValues: () => undefined | [number, number];
```

A function that **computes and returns** a min/max tuple derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.
> ⚠️ Requires that you pass a valid `getFacetedMinMaxValues` function to `options.getFacetedMinMaxValues`. A default implementation is provided via the exported `getFacetedMinMaxValues` function.

#### Returns

`undefined` \| [`number`, `number`]

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfacetedminmaxvalues)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)

#### Defined in

[features/column-faceting/ColumnFaceting.types.ts:15](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-faceting/ColumnFaceting.types.ts#L15)

***

### getFacetedRowModel()

```ts
getFacetedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model with all other column filters applied, excluding its own filter. Useful for displaying faceted result counts.
> ⚠️ Requires that you pass a valid `getFacetedRowModel` function to `options.facetedRowModel`. A default implementation is provided via the exported `getFacetedRowModel` function.

#### Returns

`RowModel`\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfacetedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)

#### Defined in

[features/column-faceting/ColumnFaceting.types.ts:22](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-faceting/ColumnFaceting.types.ts#L22)

***

### getFacetedUniqueValues()

```ts
getFacetedUniqueValues: () => Map<any, number>;
```

A function that **computes and returns** a `Map` of unique values and their occurrences derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.
> ⚠️ Requires that you pass a valid `getFacetedUniqueValues` function to `options.getFacetedUniqueValues`. A default implementation is provided via the exported `getFacetedUniqueValues` function.

#### Returns

`Map`\<`any`, `number`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfaceteduniquevalues)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)

#### Defined in

[features/column-faceting/ColumnFaceting.types.ts:29](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-faceting/ColumnFaceting.types.ts#L29)
