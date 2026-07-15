---
id: aggregationFns
title: aggregationFns
---

# ~~Variable: aggregationFns~~

```ts
const aggregationFns: object;
```

Defined in: [features/aggregation/aggregationFns.ts:331](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/aggregation/aggregationFns.ts#L331)

Full built-in registry. Register individual definitions for tree-shaking.

## Type Declaration

### ~~count~~

```ts
count: AggregationFnDef<any, any, unknown, number> = aggregationFn_count;
```

### ~~extent~~

```ts
extent: AggregationFnDef<any, any, unknown, [RangeValue | undefined, RangeValue | undefined]> = aggregationFn_extent;
```

### ~~first~~

```ts
first: AggregationFnDef<any, any, unknown, unknown> = aggregationFn_first;
```

### ~~last~~

```ts
last: AggregationFnDef<any, any, unknown, unknown> = aggregationFn_last;
```

### ~~max~~

```ts
max: AggregationFnDef<any, any, unknown, RangeValue | undefined> = aggregationFn_max;
```

### ~~mean~~

```ts
mean: AggregationFnDef<any, any, unknown, number | undefined> = aggregationFn_mean;
```

### ~~median~~

```ts
median: AggregationFnDef<any, any, unknown, number | undefined> = aggregationFn_median;
```

### ~~min~~

```ts
min: AggregationFnDef<any, any, unknown, RangeValue | undefined> = aggregationFn_min;
```

### ~~sum~~

```ts
sum: AggregationFnDef<any, any, unknown, number> = aggregationFn_sum;
```

### ~~unique~~

```ts
unique: AggregationFnDef<any, any, unknown, unknown[]> = aggregationFn_unique;
```

### ~~uniqueCount~~

```ts
uniqueCount: AggregationFnDef<any, any, unknown, number> = aggregationFn_uniqueCount;
```

## Deprecated

Import individual `aggregationFn_*` definitions instead for a
smaller bundle. This registry remains available for compatibility.
