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

Defined in: [features/aggregation/aggregationFeature.types.ts:24](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L24)

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

Defined in: [features/aggregation/aggregationFeature.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L30)

The synthetic grouped row receiving this result. This property is omitted
for root or caller-supplied-row aggregation. Its `depth` identifies the
grouping level when grouped aggregation needs that distinction.

***

### rows

```ts
rows: readonly Row<TFeatures, TData>[];
```

Defined in: [features/aggregation/aggregationFeature.types.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L35)

Terminal leaf rows included in this aggregation. The executor normalizes
hierarchical and duplicate row inputs before invoking the definition.

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L37)

The table that owns the column and rows.
