---
id: aggregationFn_extent
title: aggregationFn_extent
---

# Function: aggregationFn\_extent()

```ts
function aggregationFn_extent<TFeatures, TData>(
   columnId, 
   _leafRows, 
   childRows): (number | undefined)[];
```

Defined in: [fns/aggregationFns.ts:94](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L94)

Finds the numeric extent for a grouped column.

Returns `[min, max]`, where each entry is `undefined` when no numeric value is
present.

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

(`number` \| `undefined`)[]
