---
id: aggregationFn_max
title: aggregationFn_max
---

# Function: aggregationFn\_max()

```ts
function aggregationFn_max<TFeatures, TData>(
   columnId, 
   _leafRows, 
   childRows): number | undefined;
```

Defined in: [fns/aggregationFns.ts:64](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L64)

Finds the maximum numeric child-row value for a grouped column.

Nullish and non-number values are ignored. Returns `undefined` when no
numeric value is found.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### columnId

`string`

### \_leafRows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

### childRows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

## Returns

`number` \| `undefined`
