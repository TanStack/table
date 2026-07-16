---
id: TableOptions_Aggregation
title: TableOptions_Aggregation
---

# Interface: TableOptions\_Aggregation

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:332](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L332)

Table options installed by `rowAggregationFeature`.

## Properties

### manualAggregation?

```ts
optional manualAggregation: boolean;
```

Defined in: [features/row-aggregation/rowAggregationFeature.types.ts:338](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-aggregation/rowAggregationFeature.types.ts#L338)

Disables local `column.getAggregationValue()` calculation when a column
override does not handle the request. Group values supplied by manually
grouped rows remain the responsibility of the data owner.
