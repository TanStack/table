---
id: Table_RowModels_Faceted
title: Table_RowModels_Faceted
---

# Interface: Table\_RowModels\_Faceted\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

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

[features/column-faceting/ColumnFaceting.types.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/ColumnFaceting.types.ts#L21)

***

### getFacetedRowModel()

```ts
getFacetedRowModel: () => RowModel<TFeatures, TData>;
```

Returns the row model with all other column filters applied, excluding its own filter. Useful for displaying faceted result counts.
> ⚠️ Requires that you pass a valid `getFacetedRowModel` function to `options.facetedRowModel`. A default implementation is provided via the exported `getFacetedRowModel` function.

#### Returns

[`RowModel`](rowmodel.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfacetedrowmodel)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)

#### Defined in

[features/column-faceting/ColumnFaceting.types.ts:28](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/ColumnFaceting.types.ts#L28)

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

[features/column-faceting/ColumnFaceting.types.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/ColumnFaceting.types.ts#L35)
