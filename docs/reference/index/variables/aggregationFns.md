---
id: aggregationFns
title: aggregationFns
---

# ~~Variable: aggregationFns~~

```ts
const aggregationFns: object;
```

Defined in: [fns/aggregationFns.ts:289](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L289)

The built-in aggregation function registry.

Registering this full object opts out of tree-shaking: every built-in
aggregation function ends up in your bundle. Prefer importing the
`aggregationFn_*` functions you actually use and registering just those in
the `aggregationFns` slot, or passing them directly to the `aggregationFn`
column option.

## Type Declaration

### ~~count()~~

```ts
count: <TFeatures, TData>(_columnId, leafRows) => number = aggregationFn_count;
```

Counts the number of leaf rows in the group.

The column id is ignored because the result is based only on group size.
This is a plain row-level function (not built with
`constructAggregationFn`) because it never reads row values.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### \_columnId

`string`

##### leafRows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

#### Returns

`number`

### ~~extent~~

```ts
extent: CreatedAggregationFn<any, any> = aggregationFn_extent;
```

### ~~first()~~

```ts
first: <TFeatures, TData>(columnId, leafRows) => unknown = aggregationFn_first;
```

Returns the first leaf-row value for a grouped column.

This is a plain row-level function (not built with
`constructAggregationFn`) because it only reads one positional value.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### columnId

`string`

##### leafRows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

#### Returns

`unknown`

### ~~last()~~

```ts
last: <TFeatures, TData>(columnId, leafRows) => unknown = aggregationFn_last;
```

Returns the last leaf-row value for a grouped column.

This is a plain row-level function (not built with
`constructAggregationFn`) because it only reads one positional value.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### columnId

`string`

##### leafRows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

#### Returns

`unknown`

### ~~max~~

```ts
max: CreatedAggregationFn<any, any> = aggregationFn_max;
```

### ~~mean~~

```ts
mean: CreatedAggregationFn<any, any> = aggregationFn_mean;
```

### ~~median~~

```ts
median: CreatedAggregationFn<any, any> = aggregationFn_median;
```

### ~~min~~

```ts
min: CreatedAggregationFn<any, any> = aggregationFn_min;
```

### ~~sum~~

```ts
sum: CreatedAggregationFn<any, any> = aggregationFn_sum;
```

### ~~unique~~

```ts
unique: CreatedAggregationFn<any, any> = aggregationFn_unique;
```

### ~~uniqueCount~~

```ts
uniqueCount: CreatedAggregationFn<any, any> = aggregationFn_uniqueCount;
```

## Deprecated

Import individual `aggregationFn_*` functions instead for a
smaller bundle. This export still works and is not going away in v9, but
built-in name resolution (including `aggregationFn: 'auto'`) only finds
functions you register yourself.
