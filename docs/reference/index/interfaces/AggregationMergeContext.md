---
id: AggregationMergeContext
title: AggregationMergeContext
---

# Interface: AggregationMergeContext\<TFeatures, TData, TValue, TResult\>

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:49](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L49)

Additional values available when merging nested grouped results.

## Extends

- [`AggregationContext`](AggregationContext.md)\<`TFeatures`, `TData`, `TValue`\>

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue`

### TResult

`TResult`

## Properties

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L20)

The column whose values are being aggregated.

#### Inherited from

[`AggregationContext`](AggregationContext.md).[`column`](AggregationContext.md#column)

***

### columnId

```ts
columnId: string;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L22)

Convenience alias for `column.id`.

#### Inherited from

[`AggregationContext`](AggregationContext.md).[`columnId`](AggregationContext.md#columnid)

***

### getValue()

```ts
getValue: (row) => TValue;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L32)

Reads this column's value from one of `rows`.

#### Parameters

##### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

#### Returns

`TValue`

#### Inherited from

[`AggregationContext`](AggregationContext.md).[`getValue`](AggregationContext.md#getvalue)

***

### groupingRow?

```ts
optional groupingRow: Row<TFeatures, TData>;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L38)

The synthetic grouped row receiving this result. This property is omitted
for root or caller-supplied-row aggregation. Its `depth` identifies the
grouping level when grouped aggregation needs that distinction.

#### Inherited from

[`AggregationContext`](AggregationContext.md).[`groupingRow`](AggregationContext.md#groupingrow)

***

### maxDepth

```ts
maxDepth: number;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L24)

Maximum relative sub-row depth used to select `rows`.

#### Inherited from

[`AggregationContext`](AggregationContext.md).[`maxDepth`](AggregationContext.md#maxdepth)

***

### rows

```ts
rows: readonly Row<TFeatures, TData>[];
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:43](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L43)

Unique rows selected at `maxDepth`. Branches that end before `maxDepth`
contribute their deepest available row.

#### Inherited from

[`AggregationContext`](AggregationContext.md).[`rows`](AggregationContext.md#rows)

***

### subRowResults

```ts
subRowResults: readonly TResult[];
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:56](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L56)

Results produced for each immediate sub-row group, in sub-row order.

***

### subRows

```ts
subRows: readonly Row<TFeatures, TData>[];
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L58)

Immediate sub-row groups corresponding to `subRowResults`.

#### Overrides

[`AggregationContext`](AggregationContext.md).[`subRows`](AggregationContext.md#subrows)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L45)

The table that owns the column and rows.

#### Inherited from

[`AggregationContext`](AggregationContext.md).[`table`](AggregationContext.md#table)
