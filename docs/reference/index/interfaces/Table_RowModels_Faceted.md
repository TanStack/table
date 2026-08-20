---
id: Table_RowModels_Faceted
title: Table_RowModels_Faceted
---

# Interface: Table\_RowModels\_Faceted\<TFeatures, TData\>

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L26)

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

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L35)

Computes min/max numeric facet values for the active faceting context.

Requires a `facetedMinMaxValues` row-model factory on the `features` option.

#### Returns

\[`number`, `number`\] \| `undefined`

***

### getFacetedRowModel()

```ts
getFacetedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L41)

Computes the row model used to derive facet values.

Requires a `facetedRowModel` row-model factory on the `features` option.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getFacetedUniqueValues()

```ts
getFacetedUniqueValues: () => Map<any, number>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:47](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L47)

Computes unique facet values and occurrence counts.

Requires a `facetedUniqueValues` row-model factory on the `features` option.

#### Returns

`Map`\<`any`, `number`\>
