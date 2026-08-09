---
id: column_getIsPinned
title: column_getIsPinned
---

# Function: column\_getIsPinned()

```ts
function column_getIsPinned<TFeatures, TData, TValue>(column): ColumnPinningPosition;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:148](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L148)

Reads this column's current pinning region.

Group columns report `'start'` or `'end'` when any leaf column is pinned in
that region. Unpinned columns return `false`.

`start` and `end` are logical positions. In LTR languages/layouts, `start`
usually corresponds to left and `end` to right. In RTL languages/layouts,
`start` usually corresponds to right and `end` to left.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column_Internal`](../../index/interfaces/Column_Internal.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

[`ColumnPinningPosition`](../../index/type-aliases/ColumnPinningPosition.md)

## Example

```ts
const position = column_getIsPinned(column)
```
