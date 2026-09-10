---
id: SortFn
title: SortFn
---

# Interface: SortFn()\<TFeatures, TData\>

Defined in: [features/row-sorting/rowSortingFeature.types.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L34)

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

Defined in: [features/row-sorting/rowSortingFeature.types.ts:38](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L38)

## Parameters

### rowA

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

### rowB

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

### columnId

`string`

## Returns

`number`

## Properties

### resolveDataValue?

```ts
optional resolveDataValue: TransformDataValueFn;
```

Defined in: [features/row-sorting/rowSortingFeature.types.ts:48](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts#L48)

Normalizes each row's value before the two sides are compared. Only
honored by sorting functions built with `constructSortFn` (including all
built-in sorting functions).
