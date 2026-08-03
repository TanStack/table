---
id: TableOptions_RowAggregation
title: TableOptions_RowAggregation
---

# Interface: TableOptions\_RowAggregation

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:331](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L331)

Table options installed by `rowAggregationFeature`.

## Properties

### manualAggregation?

```ts
optional manualAggregation: boolean;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:337](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L337)

Disables local `column.getAggregationValue()` calculation when a column
override does not handle the request. Group values supplied by manually
grouped rows remain the responsibility of the data owner.
