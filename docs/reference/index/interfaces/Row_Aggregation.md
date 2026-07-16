---
id: Row_Aggregation
title: Row_Aggregation
---

# Interface: Row\_Aggregation

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:304](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L304)

Internal per-row cache used while grouped aggregates are evaluated.

## Properties

### \_aggregationValuesCache

```ts
_aggregationValuesCache: Record<string, unknown>;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:306](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L306)

Cached aggregate results keyed by column id.
