---
id: AggregationValueContext
title: AggregationValueContext
---

# Interface: AggregationValueContext\<TFeatures, TData, TValue\>

Defined in: [features/aggregation/aggregationFeature.types.ts:310](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L310)

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

Defined in: [features/aggregation/aggregationFeature.types.ts:316](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L316)

The column whose value was requested.

***

### maxDepth

```ts
maxDepth: number;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:318](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L318)

Maximum relative sub-row depth used for the request.

***

### rows?

```ts
optional rows: readonly Row<TFeatures, TData>[];
```

Defined in: [features/aggregation/aggregationFeature.types.ts:320](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L320)

Caller-provided rows, or `undefined` for the default row model.

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:322](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L322)

The table that owns the column.
