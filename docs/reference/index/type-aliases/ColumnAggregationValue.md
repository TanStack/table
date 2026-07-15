---
id: ColumnAggregationValue
title: ColumnAggregationValue
---

# Type Alias: ColumnAggregationValue\<TFeatures\>

```ts
type ColumnAggregationValue<TFeatures> = 
  | RegisteredAggregationResult<TFeatures>
  | Record<string, RegisteredAggregationResult<TFeatures> | undefined>
  | undefined;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:216](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L216)

Default public result union when a column's precise option is not known.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)
