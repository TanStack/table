---
id: aggregationFn_count
title: aggregationFn_count
---

# Function: aggregationFn\_count()

```ts
function aggregationFn_count<TFeatures, TData>(_columnId, leafRows): number;
```

Defined in: [fns/aggregationFns.ts:221](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L221)

Counts the number of leaf rows in the group.

The column id is ignored because the result is based only on group size.

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
