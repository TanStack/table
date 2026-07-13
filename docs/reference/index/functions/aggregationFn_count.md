---
id: aggregationFn_count
title: aggregationFn_count
---

# Function: aggregationFn\_count()

```ts
function aggregationFn_count<TFeatures, TData>(_columnId, leafRows): number;
```

Defined in: [fns/aggregationFns.ts:242](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L242)

Counts the number of leaf rows in the group.

The column id is ignored because the result is based only on group size.
This is a plain row-level function (not built with
`constructAggregationFn`) because it never reads row values.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### \_columnId

`string`

### leafRows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

## Returns

`number`
