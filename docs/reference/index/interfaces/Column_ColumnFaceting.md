---
id: Column_ColumnFaceting
title: Column_ColumnFaceting
---

# Interface: Column\_ColumnFaceting\<TFeatures, TData\>

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:5](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L5)

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

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L12)

Computes min/max numeric facet values for this column.

#### Returns

\[`number`, `number`\] \| `undefined`

***

### getFacetedRowModel()

```ts
getFacetedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:19](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L19)

Computes the row model used to derive this column's facet values.

Other column filters are applied, while this column's own filter is
excluded.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getFacetedUniqueValues()

```ts
getFacetedUniqueValues: () => Map<any, number>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L23)

Computes unique facet values and occurrence counts for this column.

#### Returns

`Map`\<`any`, `number`\>
