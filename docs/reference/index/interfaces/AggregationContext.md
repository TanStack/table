---
id: AggregationContext
title: AggregationContext
---

# Interface: AggregationContext\<TFeatures, TData, TValue\>

Defined in: [features/aggregation/aggregationFeature.types.ts:14](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L14)

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

Defined in: [features/aggregation/aggregationFeature.types.ts:20](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L20)

The column whose values are being aggregated.

***

### columnId

```ts
columnId: string;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:22](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L22)

Convenience alias for `column.id`.

***

### getValue()

```ts
getValue: (row) => TValue;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L32)

Reads this column's value from one of `rows`.

#### Parameters

##### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

#### Returns

`TValue`

***

### groupingRow?

```ts
optional groupingRow: Row<TFeatures, TData>;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L38)

The synthetic grouped row receiving this result. This property is omitted
for root or caller-supplied-row aggregation. Its `depth` identifies the
grouping level when grouped aggregation needs that distinction.

***

### maxDepth

```ts
maxDepth: number;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L24)

Maximum relative sub-row depth used to select `rows`.

***

### rows

```ts
rows: readonly Row<TFeatures, TData>[];
```

Defined in: [features/aggregation/aggregationFeature.types.ts:43](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L43)

Unique rows selected at `maxDepth`. Branches that end before `maxDepth`
contribute their deepest available row.

***

### subRows?

```ts
optional subRows: readonly Row<TFeatures, TData>[];
```

Defined in: [features/aggregation/aggregationFeature.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L30)

Immediate sub-rows for grouped aggregation. This property is omitted
for root or caller-supplied-row aggregation. At a terminal grouping level
these are the direct data rows; at a nested level they are sub-row groups.

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:45](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L45)

The table that owns the column and rows.
