---
id: column_getNextSortingOrder
title: column_getNextSortingOrder
---

# Function: column\_getNextSortingOrder()

```ts
function column_getNextSortingOrder<TFeatures, TData, TValue>(column, multi?): false | "asc" | "desc";
```

Defined in: [features/row-sorting/rowSortingFeature.utils.ts:326](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-sorting/rowSortingFeature.utils.ts#L326)

Resolves the next sort order for this column's toggle cycle.

The cycle starts with the first sort direction, flips between `asc` and
`desc`, and can return `false` when sorting removal is enabled.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../../index/type-aliases/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

### multi?

`boolean`

## Returns

`false` \| `"asc"` \| `"desc"`

## Example

```ts
const nextOrder = column_getNextSortingOrder(column)
```
