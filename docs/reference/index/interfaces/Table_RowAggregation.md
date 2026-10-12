---
id: Table_RowAggregation
title: Table_RowAggregation
---

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:295](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L295)

Table APIs installed by `rowAggregationFeature`.

## Properties

### \_aggregateColumnValue

```ts
_aggregateColumnValue: <TFeatures, TData>(args) => unknown;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:303](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L303)

**`Internal`**

Runs a column's configured aggregations over a set of rows. The grouped
row model aggregates through it, so tables that group without
`rowAggregationFeature` don't bundle the aggregation executor.

Executes every configured aggregation over a depth-selected row frontier.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### args

###### column

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>

###### groupingRow?

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

###### maxDepth?

`number`

###### rows

readonly [`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

###### subRows?

readonly [`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

###### uniqueRows?

`boolean`

Marks `rows` as distinct nodes of a single row tree (rows the table's own
row models produced), enabling frontier selection without the
duplicate-id guard. Caller-supplied row arrays must omit this.

#### Returns

`unknown`
