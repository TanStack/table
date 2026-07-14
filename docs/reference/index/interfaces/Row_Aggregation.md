---
id: Row_Aggregation
title: Row_Aggregation
---

# Interface: Row\_Aggregation

Defined in: [features/aggregation/aggregationFeature.types.ts:279](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L279)

Internal per-row cache used while grouped aggregates are evaluated.

## Properties

### \_aggregationValuesCache

```ts
_aggregationValuesCache: Record<string, unknown>;
```

Defined in: [features/aggregation/aggregationFeature.types.ts:281](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFeature.types.ts#L281)

Cached aggregate results keyed by column id.
