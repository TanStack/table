---
id: aggregationFns
title: aggregationFns
---

# Variable: aggregationFns

```ts
const aggregationFns: object;
```

Defined in: [fns/aggregationFns.ts:225](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L225)

The built-in aggregation function registry.

Pass this object to grouped row model creation or extend it with custom aggregation functions for grouped columns.

## Type Declaration

### count

```ts
count: AggregationFn<any, any> = aggregationFn_count;
```

### extent

```ts
extent: AggregationFn<any, any> = aggregationFn_extent;
```

### max

```ts
max: AggregationFn<any, any> = aggregationFn_max;
```

### mean

```ts
mean: AggregationFn<any, any> = aggregationFn_mean;
```

### median

```ts
median: AggregationFn<any, any> = aggregationFn_median;
```

### min

```ts
min: AggregationFn<any, any> = aggregationFn_min;
```

### sum

```ts
sum: AggregationFn<any, any> = aggregationFn_sum;
```

### unique

```ts
unique: AggregationFn<any, any> = aggregationFn_unique;
```

### uniqueCount

```ts
uniqueCount: AggregationFn<any, any> = aggregationFn_uniqueCount;
```
