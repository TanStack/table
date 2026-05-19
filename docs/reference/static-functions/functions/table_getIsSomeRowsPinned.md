---
id: table_getIsSomeRowsPinned
title: table_getIsSomeRowsPinned
---

# Function: table\_getIsSomeRowsPinned()

```ts
function table_getIsSomeRowsPinned<TFeatures, TData>(table, position?): boolean;
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L93)

Checks whether any rows are pinned.

Omit `position` to check both regions, or pass `'top'`/`'bottom'` to inspect
one region.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### position?

[`RowPinningPosition`](../../index/type-aliases/RowPinningPosition.md)

## Returns

`boolean`

## Example

```ts
const hasPinnedRows = table_getIsSomeRowsPinned(table)
```
