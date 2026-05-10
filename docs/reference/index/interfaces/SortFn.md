---
id: SortFn
title: SortFn
---

# Interface: SortFn()\<TFeatures, TData\>

Defined in: [features/row-sorting/rowSortingFeature.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L30)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

```ts
SortFn(
   rowA, 
   rowB, 
   columnId): number;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L34)

## Parameters

### rowA

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

### rowB

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

### columnId

`string`

## Returns

`number`
