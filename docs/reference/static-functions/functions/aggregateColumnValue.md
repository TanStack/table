---
id: aggregateColumnValue
title: aggregateColumnValue
---

# Function: aggregateColumnValue()

```ts
function aggregateColumnValue<TFeatures, TData>(args): unknown;
```

Defined in: [features/aggregation/aggregationFeature.utils.ts:248](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.utils.ts#L248)

Executes every configured aggregation for a column over normalized rows.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### args

#### childRows?

readonly [`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

#### column

[`Column`](../../index/type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>

#### groupingRow?

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

#### rows

readonly [`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

## Returns

`unknown`
