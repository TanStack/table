---
id: Table_ColumnFaceting
title: Table_ColumnFaceting
---

# Interface: Table\_ColumnFaceting\<TFeatures, TData\>

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L93)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getGlobalFacetedMinMaxValues()

```ts
getGlobalFacetedMinMaxValues: () => [number, number] | undefined;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:100](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L100)

Returns the min and max values for the global filter.

#### Returns

\[`number`, `number`\] \| `undefined`

***

### getGlobalFacetedRowModel()

```ts
getGlobalFacetedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:104](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L104)

Computes the row model used to derive global facet values.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getGlobalFacetedUniqueValues()

```ts
getGlobalFacetedUniqueValues: () => Map<any, number>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:108](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L108)

Returns the faceted unique values for the global filter.

#### Returns

`Map`\<`any`, `number`\>
