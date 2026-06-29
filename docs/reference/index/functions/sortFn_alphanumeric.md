---
id: sortFn_alphanumeric
title: sortFn_alphanumeric
---

# Function: sortFn\_alphanumeric()

```ts
function sortFn_alphanumeric<TFeatures, TData>(
   rowA, 
   rowB, 
   columnId): number;
```

Defined in: [fns/sortFns.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/sortFns.ts#L18)

Sorts rows with the built-in alphanumeric strategy.

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

`number`
