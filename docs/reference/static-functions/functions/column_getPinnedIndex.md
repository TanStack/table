---
id: column_getPinnedIndex
title: column_getPinnedIndex
---

# Function: column\_getPinnedIndex()

```ts
function column_getPinnedIndex<TFeatures, TData, TValue>(column): number;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:164](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L164)

Finds this column's index within its pinned region.

Unpinned columns return `0`; pinned columns return their position in
`state.columnPinning.left` or `state.columnPinning.right`.

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

## Returns

`number`

## Example

```ts
const index = column_getPinnedIndex(column)
```
