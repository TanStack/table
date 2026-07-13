---
id: aggregationFn_first
title: aggregationFn_first
---

# Function: aggregationFn\_first()

```ts
function aggregationFn_first<TFeatures, TData>(columnId, leafRows): unknown;
```

Defined in: [fns/aggregationFns.ts:255](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L255)

Returns the first leaf-row value for a grouped column.

This is a plain row-level function (not built with
`constructAggregationFn`) because it only reads one positional value.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### columnId

`string`

### leafRows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

## Returns

`unknown`
