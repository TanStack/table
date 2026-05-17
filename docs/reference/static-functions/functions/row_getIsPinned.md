---
id: row_getIsPinned
title: row_getIsPinned
---

# Function: row\_getIsPinned()

```ts
function row_getIsPinned<TFeatures, TData>(row): RowPinningPosition;
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:225](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L225)

Returns is pinned for a row.

This is the static implementation behind the matching row instance API and may read row caches or table state atoms.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

[`RowPinningPosition`](../../index/type-aliases/RowPinningPosition.md)

## Example

```ts
const value = row_getIsPinned(row)
```
