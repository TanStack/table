---
id: row_getPinnedIndex
title: row_getPinnedIndex
---

# Function: row\_getPinnedIndex()

```ts
function row_getPinnedIndex<TFeatures, TData>(row): number;
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:259](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L259)

Finds this row's visible index within its pinned region.

Unpinned rows return `-1`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

`number`

## Example

```ts
const index = row_getPinnedIndex(row)
```
