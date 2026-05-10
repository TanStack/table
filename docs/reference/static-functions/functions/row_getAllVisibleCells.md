---
id: row_getAllVisibleCells
title: row_getAllVisibleCells
---

# Function: row\_getAllVisibleCells()

```ts
function row_getAllVisibleCells<TFeatures, TData>(row): Cell<TFeatures, TData, unknown>[];
```

Defined in: [features/column-visibility/columnVisibilityFeature.utils.ts:128](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L128)

Returns all visible cells for a row.

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

[`Cell`](../../index/type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Example

```ts
const value = row_getAllVisibleCells(row)
```
