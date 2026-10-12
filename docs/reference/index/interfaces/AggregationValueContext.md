---
id: AggregationValueContext
title: AggregationValueContext
---

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:307](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L307)

Values passed to a column-level aggregation-value provider.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* [`CellData`](../type-aliases/CellData.md) = [`CellData`](../type-aliases/CellData.md)

## Properties

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:313](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L313)

The column whose value was requested.

***

### maxDepth

```ts
maxDepth: number;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:315](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L315)

Maximum relative sub-row depth used for the request.

***

### rows?

```ts
optional rows?: readonly Row<TFeatures, TData>[];
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:317](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L317)

Caller-provided rows, or `undefined` for the default row model.

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:319](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L319)

The table that owns the column.
