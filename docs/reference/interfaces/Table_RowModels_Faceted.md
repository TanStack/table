---
id: Table_RowModels_Faceted
title: Table_RowModels_Faceted
---

# Interface: Table\_RowModels\_Faceted\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L24)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getFacetedMinMaxValues()

```ts
getFacetedMinMaxValues: () => [number, number] | undefined;
```

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L32)

A function that **computes and returns** a min/max tuple derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.
> ⚠️ Requires that you pass a valid `getFacetedMinMaxValues` function to `options.getFacetedMinMaxValues`. A default implementation is provided via the exported `getFacetedMinMaxValues` function.

#### Returns

\[`number`, `number`\] \| `undefined`

***

### getFacetedRowModel()

```ts
getFacetedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L37)

Returns the row model with all other column filters applied, excluding its own filter. Useful for displaying faceted result counts.
> ⚠️ Requires that you pass a valid `getFacetedRowModel` function to `options.facetedRowModel`. A default implementation is provided via the exported `getFacetedRowModel` function.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getFacetedUniqueValues()

```ts
getFacetedUniqueValues: () => Map<any, number>;
```

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts:42](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L42)

A function that **computes and returns** a `Map` of unique values and their occurrences derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.
> ⚠️ Requires that you pass a valid `getFacetedUniqueValues` function to `options.getFacetedUniqueValues`. A default implementation is provided via the exported `getFacetedUniqueValues` function.

#### Returns

`Map`\<`any`, `number`\>
