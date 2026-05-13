---
id: row_getRightVisibleCells
title: row_getRightVisibleCells
---

# Function: row\_getRightVisibleCells()

```ts
function row_getRightVisibleCells<TFeatures, TData>(row): any[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:237](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L237)

Returns right visible cells for a row.

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
const value = row_getRightVisibleCells(row)
```
