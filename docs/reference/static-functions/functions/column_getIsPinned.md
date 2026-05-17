---
id: column_getIsPinned
title: column_getIsPinned
---

# Function: column\_getIsPinned()

```ts
function column_getIsPinned<TFeatures, TData, TValue>(column): ColumnPinningPosition;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:135](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L135)

Reads this column's current pinning region.

Group columns report `'left'` or `'right'` when any leaf column is pinned in
that region. Unpinned columns return `false`.

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

[`ColumnPinningPosition`](../../index/type-aliases/ColumnPinningPosition.md)

## Example

```ts
const position = column_getIsPinned(column)
```
