---
id: constructAggregationFn
title: constructAggregationFn
---

# Function: constructAggregationFn()

```ts
function constructAggregationFn<TFeatures, TData>(def): CreatedAggregationFn<TFeatures, TData>;
```

Defined in: [fns/aggregationFns.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L34)

Builds an `AggregationFn` from a value-level reducer plus optional
`resolveDataValue` and `fromRows` settings.

The `aggregate` reducer receives an array of the group rows' values, each
already passed through `resolveDataValue` when one is defined. Keeping
normalization in the resolver means a variant of an existing aggregation
function only has to swap the resolver, not re-implement the computation.

The definition is attached to the returned function, so a variant can be
created by spreading a built-in aggregation function and overriding what
differs. For example, a `min` that works on date columns:

```ts
const earliest = constructAggregationFn({
  ...aggregationFn_min,
  resolveDataValue: (value) =>
    value instanceof Date ? value.getTime() : value,
})
```

The built-in `count`, `first`, and `last` aggregation functions are plain
row-level functions instead: they read group position or size and never
look at every value, so materializing a values array would be wasted work.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md) = `any`

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md) = `any`

## Parameters

### def

[`AggregationFnDef`](../interfaces/AggregationFnDef.md)\<`TFeatures`, `TData`\>

## Returns

[`CreatedAggregationFn`](../interfaces/CreatedAggregationFn.md)\<`TFeatures`, `TData`\>
