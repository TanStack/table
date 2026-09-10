---
id: Table_ColumnFaceting
title: Table_ColumnFaceting
---

# Interface: Table\_ColumnFaceting\<TFeatures, TData\>

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L62)

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

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L69)

Returns the min and max values for the global filter.

#### Returns

\[`number`, `number`\] \| `undefined`

***

### getGlobalFacetedRowModel()

```ts
getGlobalFacetedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:73](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L73)

Computes the row model used to derive global facet values.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getGlobalFacetedUniqueValues()

```ts
getGlobalFacetedUniqueValues: () => Map<any, number>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:77](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L77)

Returns the faceted unique values for the global filter.

#### Returns

`Map`\<`any`, `number`\>
