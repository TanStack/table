---
id: aggregationFn_sum
title: aggregationFn_sum
---

# Function: aggregationFn\_sum()

```ts
function aggregationFn_sum<TFeatures, TData>(
   columnId, 
   _leafRows, 
   childRows): number;
```

Defined in: [fns/aggregationFns.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/aggregationFns.ts#L11)

Sums numeric child-row values for a grouped column.

Non-number values contribute `0`. Child rows are used so nested group totals
can reuse already aggregated values.

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

`number`
