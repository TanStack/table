---
id: TableOptions_Aggregation
title: TableOptions_Aggregation
---

# Interface: TableOptions\_Aggregation

Defined in: [features/aggregation/aggregationFeature.types.ts:305](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L305)

Table options installed by `aggregationFeature`.

## Properties

### manualAggregation?

```ts
optional manualAggregation: boolean;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:311](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L311)

Disables local `column.getAggregationValue()` calculation when a column
override does not handle the request. Group values supplied by manually
grouped rows remain the responsibility of the data owner.
