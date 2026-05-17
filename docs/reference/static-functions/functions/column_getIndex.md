---
id: column_getIndex
title: column_getIndex
---

# Function: column\_getIndex()

```ts
function column_getIndex<TFeatures, TData, TValue>(column, position?): number;
```

Defined in: [features/column-ordering/columnOrderingFeature.utils.ts:37](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/columnOrderingFeature.utils.ts#L37)

Finds this column's index within a visible pinning region.

Pass `'left'`, `'center'`, or `'right'` to search that region; omit the
position to search the full visible leaf column list.

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

### position?

[`ColumnPinningPosition`](../../index/type-aliases/ColumnPinningPosition.md) | `"center"`

## Returns

`number`

## Example

```ts
const index = column_getIndex(column, 'center')
```
