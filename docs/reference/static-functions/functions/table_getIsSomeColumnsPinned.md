---
id: table_getIsSomeColumnsPinned
title: table_getIsSomeColumnsPinned
---

# Function: table\_getIsSomeColumnsPinned()

```ts
function table_getIsSomeColumnsPinned<TFeatures, TData>(table, position?): boolean;
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:337](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L337)

Checks whether any columns are pinned.

Omit `position` to check both sides, or pass `'left'`/`'right'` to inspect a
single pinning region.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### position?

[`ColumnPinningPosition`](../../index/type-aliases/ColumnPinningPosition.md)

## Returns

`boolean`

## Example

```ts
const hasPinnedColumns = table_getIsSomeColumnsPinned(table)
```
