---
id: Row_RowAggregation
title: Row_RowAggregation
---

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:289](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L289)

Internal per-row cache used while grouped aggregates are evaluated.

## Properties

### \_aggregationValuesCache?

```ts
optional _aggregationValuesCache?: Record<string, unknown>;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:291](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L291)

Cached aggregate results keyed by column id; created lazily on grouped rows.
