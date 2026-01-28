---
id: CachedRowModel_Faceted
title: CachedRowModel_Faceted
---

# Interface: CachedRowModel\_Faceted\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts:72](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L72)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### facetedMinMaxValues()?

```ts
optional facetedMinMaxValues: (columnId) => [number, number];
```

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts:77](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L77)

#### Parameters

##### columnId

`string`

#### Returns

\[`number`, `number`\]

***

### facetedRowModel()?

```ts
optional facetedRowModel: (columnId) => () => RowModel<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L76)

#### Parameters

##### columnId

`string`

#### Returns

```ts
(): RowModel<TFeatures, TData>;
```

##### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### facetedUniqueValues()?

```ts
optional facetedUniqueValues: (columnId) => Map<any, number>;
```

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts:78](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L78)

#### Parameters

##### columnId

`string`

#### Returns

`Map`\<`any`, `number`\>
