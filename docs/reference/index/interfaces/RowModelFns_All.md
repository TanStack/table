---
id: RowModelFns_All
title: RowModelFns_All
---

# Interface: RowModelFns\_All\<TFeatures, TData\>

Defined in: [types/RowModelFns.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/types/RowModelFns.ts#L25)

## Extends

- `Partial`\<[`RowModelFns_ColumnFiltering`](RowModelFns_ColumnFiltering.md)\<`TFeatures`, `TData`\> & [`RowModelFns_Aggregation`](RowModelFns_Aggregation.md)\<`TFeatures`, `TData`\> & [`RowModelFns_RowSorting`](RowModelFns_RowSorting.md)\<`TFeatures`, `TData`\>\>

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### aggregationFns?

```ts
optional aggregationFns: Record<string, AggregationFnDef<TFeatures, TData, any, any>>;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L91)

#### Inherited from

```ts
Partial.aggregationFns
```

***

### filterFns?

```ts
optional filterFns: Record<string, FilterFn<TFeatures, TData>>;
```

Defined in: [features/column-filtering/columnFilteringFeature.types.ts:57](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts#L57)

#### Inherited from

```ts
Partial.filterFns
```

***

### sortFns?

```ts
optional sortFns: Record<string, SortFn<TFeatures, TData>>;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:29](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L29)

#### Inherited from

```ts
Partial.sortFns
```
