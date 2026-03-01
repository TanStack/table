---
id: CreateRowModel_Faceted
title: CreateRowModel_Faceted
---

# Interface: CreateRowModel\_Faceted\<TFeatures, TData\>

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L45)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### facetedMinMaxValues()?

```ts
optional facetedMinMaxValues: (table, columnId) => () => [number, number] | undefined;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:52](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L52)

This function is used to retrieve the faceted min/max values. If using server-side faceting, this function is not required. To use client-side faceting, pass the exported `getFacetedMinMaxValues()` from your adapter to your table or implement your own.

#### Parameters

##### table

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>

##### columnId

`string`

#### Returns

```ts
(): [number, number] | undefined;
```

##### Returns

\[`number`, `number`\] \| `undefined`

***

### facetedRowModel()?

```ts
optional facetedRowModel: (table, columnId) => () => RowModel<TFeatures, TData>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L59)

This function is used to retrieve the faceted row model. If using server-side faceting, this function is not required. To use client-side faceting, pass the exported `getFacetedRowModel()` from your adapter to your table or implement your own.

#### Parameters

##### table

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>

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
optional facetedUniqueValues: (table, columnId) => () => Map<any, number>;
```

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L66)

This function is used to retrieve the faceted unique values. If using server-side faceting, this function is not required. To use client-side faceting, pass the exported `getFacetedUniqueValues()` from your adapter to your table or implement your own.

#### Parameters

##### table

[`Table`](../type-aliases/Table.md)\<`TFeatures`, `TData`\>

##### columnId

`string`

#### Returns

```ts
(): Map<any, number>;
```

##### Returns

`Map`\<`any`, `number`\>
