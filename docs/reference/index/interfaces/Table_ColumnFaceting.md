---
id: Table_ColumnFaceting
title: Table_ColumnFaceting
---

# Interface: Table\_ColumnFaceting\<TFeatures, TData\>

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L87)

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

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:94](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L94)

Returns the min and max values for the global filter.

#### Returns

\[`number`, `number`\] \| `undefined`

***

### getGlobalFacetedRowModel()

```ts
getGlobalFacetedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:98](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L98)

Returns the row model for the table after **global** filtering has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getGlobalFacetedUniqueValues()

```ts
getGlobalFacetedUniqueValues: () => Map<any, number>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:102](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L102)

Returns the faceted unique values for the global filter.

#### Returns

`Map`\<`any`, `number`\>
