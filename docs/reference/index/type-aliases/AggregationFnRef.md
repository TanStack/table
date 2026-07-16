---
id: AggregationFnRef
title: AggregationFnRef
---

# Type Alias: AggregationFnRef\<TFeatures, TData, TValue, TResult\>

```ts
type AggregationFnRef<TFeatures, TData, TValue, TResult> = 
  | "auto"
  | ExtractAggregationFnKeys<TFeatures>
| AggregationFnDef<TFeatures, TData, TValue, TResult>;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:117](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L117)

A registered name, automatic inference, or inline aggregation definition.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

### TValue

`TValue` = `unknown`

### TResult

`TResult` = `unknown`
