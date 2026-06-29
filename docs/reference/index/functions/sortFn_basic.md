---
id: sortFn_basic
title: sortFn_basic
---

# Function: sortFn\_basic()

```ts
function sortFn_basic<TFeatures, TData>(
   rowA, 
   rowB, 
   columnId): -1 | 0 | 1;
```

Defined in: [fns/sortFns.ts:120](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/sortFns.ts#L120)

Sorts rows with the built-in basic strategy.

This comparator returns ascending-order results; descending order is applied by the sorting row model.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### rowA

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

### rowB

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

### columnId

`string`

## Returns

`-1` \| `0` \| `1`
