---
id: AggregationContext
title: AggregationContext
---

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L15)

Values and table objects available while one aggregation is evaluated.

## Extended by

- [`AggregationMergeContext`](AggregationMergeContext.md)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` = `unknown`

## Properties

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:21](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L21)

The column whose values are being aggregated.

***

### columnId

```ts
columnId: string;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:23](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L23)

Convenience alias for `column.id`.

***

### getValue

```ts
getValue: (row) => TValue;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:33](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L33)

Reads this column's value from one of `rows`.

#### Parameters

##### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

#### Returns

`TValue`

***

### groupingRow?

```ts
optional groupingRow?: Row<TFeatures, TData>;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:39](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L39)

The synthetic grouped row receiving this result. This property is omitted
for root or caller-supplied-row aggregation. Its `depth` identifies the
grouping level when grouped aggregation needs that distinction.

***

### maxDepth

```ts
maxDepth: number;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:25](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L25)

Maximum relative sub-row depth used to select `rows`.

***

### rows

```ts
rows: readonly Row<TFeatures, TData>[];
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L44)

Unique rows selected at `maxDepth`. Branches that end before `maxDepth`
contribute their deepest available row.

***

### subRows?

```ts
optional subRows?: readonly Row<TFeatures, TData>[];
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:31](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L31)

Immediate sub-rows for grouped aggregation. This property is omitted
for root or caller-supplied-row aggregation. At a terminal grouping level
these are the direct data rows; at a nested level they are sub-row groups.

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:46](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L46)

The table that owns the column and rows.
