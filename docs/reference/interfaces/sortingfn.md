---
id: SortingFn
title: SortingFn
---

# Interface: SortingFn()\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

```ts
interface SortingFn(
   rowA, 
   rowB, 
   columnId): number
```

## Parameters

• **rowA**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

• **rowB**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

• **columnId**: `string`

## Returns

`number`

## Defined in

[features/row-sorting/RowSorting.types.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/RowSorting.types.ts#L34)
