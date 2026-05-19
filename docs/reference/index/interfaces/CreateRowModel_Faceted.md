---
id: CreateRowModel_Faceted
title: CreateRowModel_Faceted
---

# Interface: CreateRowModel\_Faceted\<TFeatures, TData\>

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:51](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L51)

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

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L60)

Factory used to retrieve faceted min/max values. If using server-side
faceting, this is not required. To use client-side faceting, pass
`createFacetedMinMaxValues()` or implement your own factory.

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

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L69)

Factory used to retrieve the faceted row model. If using server-side
faceting, this is not required. To use client-side faceting, pass
`createFacetedRowModel()` or implement your own factory.

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

Defined in: [features/column-faceting/columnFacetingFeature.types.ts:78](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L78)

Factory used to retrieve faceted unique values. If using server-side
faceting, this is not required. To use client-side faceting, pass
`createFacetedUniqueValues()` or implement your own factory.

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
