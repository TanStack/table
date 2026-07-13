---
id: aggregationFn_last
title: aggregationFn_last
---

# Function: aggregationFn\_last()

```ts
function aggregationFn_last<TFeatures, TData>(columnId, leafRows): unknown;
```

Defined in: [fns/aggregationFns.ts:268](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L268)

Returns the last leaf-row value for a grouped column.

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
