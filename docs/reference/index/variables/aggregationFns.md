---
id: aggregationFns
title: aggregationFns
---

# Variable: aggregationFns

```ts
const aggregationFns: object;
```

Defined in: [fns/aggregationFns.ts:233](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L233)

The built-in aggregation function registry.

Pass this object to grouped row model creation or extend it with custom aggregation functions for grouped columns.

## Type Declaration

### count()

```ts
count: <TFeatures, TData>(_columnId, leafRows) => number = aggregationFn_count;
```

Counts the number of leaf rows in the group.

The column id is ignored because the result is based only on group size.

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

### extent()

```ts
extent: <TFeatures, TData>(columnId, _leafRows, childRows) => (number | undefined)[] = aggregationFn_extent;
```

Finds the numeric extent for a grouped column.

Returns `[min, max]`, where each entry is `undefined` when no numeric value is
present.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### columnId

`string`

##### \_leafRows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

##### childRows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

#### Returns

(`number` \| `undefined`)[]

### max()

```ts
max: <TFeatures, TData>(columnId, _leafRows, childRows) => number | undefined = aggregationFn_max;
```

Finds the maximum numeric child-row value for a grouped column.

Nullish and non-number values are ignored. Returns `undefined` when no
numeric value is found.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### columnId

`string`

##### \_leafRows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

##### childRows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

#### Returns

`number` \| `undefined`

### mean()

```ts
mean: <TFeatures, TData>(columnId, leafRows) => number | undefined = aggregationFn_mean;
```

Averages numeric leaf-row values for a grouped column.

Number-like values are coerced with unary `+`; nullish and non-numeric values
are ignored.

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

`number` \| `undefined`

### median()

```ts
median: <TFeatures, TData>(columnId, leafRows) => number | undefined = aggregationFn_median;
```

Computes the median of numeric leaf-row values for a grouped column.

All values must be numbers. If any value is non-numeric, or no leaf rows are
present, the result is `undefined`.

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

`number` \| `undefined`

### min()

```ts
min: <TFeatures, TData>(columnId, _leafRows, childRows) => number | undefined = aggregationFn_min;
```

Finds the minimum numeric child-row value for a grouped column.

Nullish and non-number values are ignored. Returns `undefined` when no
numeric value is found.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### columnId

`string`

##### \_leafRows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

##### childRows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

#### Returns

`number` \| `undefined`

### sum()

```ts
sum: <TFeatures, TData>(columnId, _leafRows, childRows) => number = aggregationFn_sum;
```

Sums numeric child-row values for a grouped column.

Non-number values contribute `0`. Child rows are used so nested group totals
can reuse already aggregated values.

#### Type Parameters

##### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

##### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

#### Parameters

##### columnId

`string`

##### \_leafRows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

##### childRows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

#### Returns

`number`

### unique()

```ts
unique: <TFeatures, TData>(columnId, leafRows) => unknown[] = aggregationFn_unique;
```

Collects unique leaf-row values for a grouped column.

Values are compared with JavaScript `Set` semantics.

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

`unknown`[]

### uniqueCount()

```ts
uniqueCount: <TFeatures, TData>(columnId, leafRows) => number = aggregationFn_uniqueCount;
```

Counts unique leaf-row values for a grouped column.

Values are compared with JavaScript `Set` semantics.

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

`number`
