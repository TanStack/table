---
id: CachedRowModel_Faceted
title: CachedRowModel_Faceted
---

# Interface: CachedRowModel\_Faceted\<TFeatures, TData\>

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L50)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### facetedMinMaxValues?

```ts
optional facetedMinMaxValues: Record<string, () => [number, number] | undefined>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L55)

***

### facetedRowModels?

```ts
optional facetedRowModels: Record<string, () => RowModel<TFeatures, TData>>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L54)

***

### facetedUniqueValues?

```ts
optional facetedUniqueValues: Record<string, () => Map<any, number>>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L56)

***

### globalFacetedMinMaxValues()?

```ts
optional globalFacetedMinMaxValues: () => [number, number] | undefined;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L58)

#### Returns

\[`number`, `number`\] \| `undefined`

***

### globalFacetedRowModel()?

```ts
optional globalFacetedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:57](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L57)

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### globalFacetedUniqueValues()?

```ts
optional globalFacetedUniqueValues: () => Map<any, number>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L59)

#### Returns

`Map`\<`any`, `number`\>
