---
id: Table_ColumnFaceting
title: Table_ColumnFaceting
---

# Interface: Table\_ColumnFaceting\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts:81](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L81)

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

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts:88](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L88)

Returns the min and max values for the global filter.

#### Returns

\[`number`, `number`\] \| `undefined`

***

### getGlobalFacetedRowModel()

```ts
getGlobalFacetedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts:92](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L92)

Returns the row model for the table after **global** filtering has been applied.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getGlobalFacetedUniqueValues()

```ts
getGlobalFacetedUniqueValues: () => Map<any, number>;
```

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts:96](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L96)

Returns the faceted unique values for the global filter.

#### Returns

`Map`\<`any`, `number`\>
