---
id: column_getToggleGroupingHandler
title: column_getToggleGroupingHandler
---

# Function: column\_getToggleGroupingHandler()

```ts
function column_getToggleGroupingHandler<TFeatures, TData, TValue>(column): () => void
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`Function`

### Returns

`void`

## Defined in

[features/column-grouping/ColumnGrouping.utils.ts:64](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.utils.ts#L64)
