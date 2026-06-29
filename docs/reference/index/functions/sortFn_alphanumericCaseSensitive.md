---
id: sortFn_alphanumericCaseSensitive
title: sortFn_alphanumericCaseSensitive
---

# Function: sortFn\_alphanumericCaseSensitive()

```ts
function sortFn_alphanumericCaseSensitive<TFeatures, TData>(
   rowA, 
   rowB, 
   columnId): number;
```

Defined in: [fns/sortFns.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/fns/sortFns.ts#L37)

Sorts rows with the built-in alphanumeric case sensitive strategy.

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
