---
id: Column_ColumnFaceting
title: Column_ColumnFaceting
---

# Interface: Column\_ColumnFaceting\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts:6](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L6)

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

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts:13](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L13)

A function that **computes and returns** a min/max tuple derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.

#### Returns

\[`number`, `number`\] \| `undefined`

***

### getFacetedRowModel()

```ts
getFacetedRowModel: () => RowModel<TFeatures, TData>;
```

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts:17](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L17)

A function that **computes and returns** a row model with all other column filters applied, excluding its own filter. Useful for displaying faceted result counts.

#### Returns

[`RowModel`](RowModel.md)\<`TFeatures`, `TData`\>

***

### getFacetedUniqueValues()

```ts
getFacetedUniqueValues: () => Map<any, number>;
```

Defined in: [packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-faceting/columnFacetingFeature.types.ts#L21)

Returns a `Map` of unique values and their occurrences derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.

#### Returns

`Map`\<`any`, `number`\>
