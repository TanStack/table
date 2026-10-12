---
id: TableOptions_RowAggregation
title: TableOptions_RowAggregation
---

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:329](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L329)

Table options installed by `rowAggregationFeature`.

## Properties

### manualAggregation?

```ts
optional manualAggregation?: boolean;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:335](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L335)

Disables local `column.getAggregationValue()` calculation when a column
override does not handle the request. Group values supplied by manually
grouped rows remain the responsibility of the data owner.
