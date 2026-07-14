---
id: constructAggregationFn
title: constructAggregationFn
---

# Function: constructAggregationFn()

```ts
function constructAggregationFn<TFeatures, TData, TValue, TResult>(definition): AggregationFnDef<TFeatures, TData, TValue, TResult>;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:75](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L75)

Creates a typed context-based aggregation definition for a column or
aggregation-function registry.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md) = `any`

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

### TValue

`TValue` = `unknown`

### TResult

`TResult` = `unknown`

## Parameters

### definition

[`AggregationFnDef`](../interfaces/AggregationFnDef.md)\<`TFeatures`, `TData`, `TValue`, `TResult`\>

## Returns

[`AggregationFnDef`](../interfaces/AggregationFnDef.md)\<`TFeatures`, `TData`, `TValue`, `TResult`\>
