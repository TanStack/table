---
id: AggregationMergeContext
title: AggregationMergeContext
---

# Interface: AggregationMergeContext\<TFeatures, TData, TValue, TResult\>

Defined in: [features/aggregation/aggregationFeature.types.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L41)

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

### childResults

```ts
childResults: readonly TResult[];
```

Defined in: [features/aggregation/aggregationFeature.types.ts:48](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L48)

Results produced for each immediate child group, in child-row order.

***

### childRows

```ts
childRows: readonly Row<TFeatures, TData>[];
```

Defined in: [features/aggregation/aggregationFeature.types.ts:50](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L50)

Immediate child group rows corresponding to `childResults`.

***

### column

```ts
column: Column<TFeatures, TData, TValue>;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L20)

The column whose values are being aggregated.

#### Inherited from

[`AggregationContext`](AggregationContext.md).[`column`](AggregationContext.md#column)

***

### columnId

```ts
columnId: string;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L22)

Convenience alias for `column.id`.

#### Inherited from

[`AggregationContext`](AggregationContext.md).[`columnId`](AggregationContext.md#columnid)

***

### getValue()

```ts
getValue: (row) => TValue;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L24)

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

Defined in: [features/aggregation/aggregationFeature.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L30)

The synthetic grouped row receiving this result. This property is omitted
for root or caller-supplied-row aggregation. Its `depth` identifies the
grouping level when grouped aggregation needs that distinction.

#### Inherited from

[`AggregationContext`](AggregationContext.md).[`groupingRow`](AggregationContext.md#groupingrow)

***

### rows

```ts
rows: readonly Row<TFeatures, TData>[];
```

Defined in: [features/aggregation/aggregationFeature.types.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L35)

Terminal leaf rows included in this aggregation. The executor normalizes
hierarchical and duplicate row inputs before invoking the definition.

#### Inherited from

[`AggregationContext`](AggregationContext.md).[`rows`](AggregationContext.md#rows)

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L37)

The table that owns the column and rows.

#### Inherited from

[`AggregationContext`](AggregationContext.md).[`table`](AggregationContext.md#table)
