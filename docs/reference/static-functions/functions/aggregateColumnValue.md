---
id: aggregateColumnValue
title: aggregateColumnValue
---

# Function: aggregateColumnValue()

```ts
function aggregateColumnValue<TFeatures, TData>(args): unknown;
```

Defined in: [features/aggregation/aggregationFeature.utils.ts:261](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.utils.ts#L261)

Executes every configured aggregation over a depth-selected row frontier.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### args

#### column

[`Column`](../../index/type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>

#### groupingRow?

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

#### maxDepth?

`number`

#### rows

readonly [`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

#### subRows?

readonly [`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

## Returns

`unknown`
