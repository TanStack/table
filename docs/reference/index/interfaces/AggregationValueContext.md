---
id: AggregationValueContext
title: AggregationValueContext
---

# Interface: AggregationValueContext\<TFeatures, TData, TValue\>

Defined in: [features/aggregation/aggregationFeature.types.ts:285](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L285)

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

Defined in: [features/aggregation/aggregationFeature.types.ts:291](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L291)

The column whose value was requested.

***

### rows?

```ts
optional rows: readonly Row<TFeatures, TData>[];
```

Defined in: [features/aggregation/aggregationFeature.types.ts:293](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L293)

Caller-provided rows, or `undefined` for the default row model.

***

### table

```ts
table: Table<TFeatures, TData>;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:295](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L295)

The table that owns the column.
