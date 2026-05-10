---
id: row_getCenterVisibleCells
title: row_getCenterVisibleCells
---

# Function: row\_getCenterVisibleCells()

```ts
function row_getCenterVisibleCells<TFeatures, TData>(row): any[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:178](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L178)

Returns center visible cells for a row.

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

`any`[]

## Example

```ts
const value = row_getCenterVisibleCells(row)
```
