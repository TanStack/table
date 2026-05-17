---
id: row_getPinnedIndex
title: row_getPinnedIndex
---

# Function: row\_getPinnedIndex()

```ts
function row_getPinnedIndex<TFeatures, TData>(row): number;
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:249](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L249)

Returns pinned index for a row.

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

`number`

## Example

```ts
const value = row_getPinnedIndex(row)
```
