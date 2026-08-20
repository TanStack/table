---
id: column_getCanSpan
title: column_getCanSpan
---

# Function: column\_getCanSpan()

```ts
function column_getCanSpan<TFeatures, TData, TValue>(column): boolean;
```

Defined in: [features/cell-spanning/cellSpanningFeature.utils.ts:124](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.utils.ts#L124)

Checks whether this column takes part in cell spanning.

A column def opting out with `enableCellSpanning: false` wins over the table
option, matching how the other per-column enable flags resolve.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column`](../../index/type-aliases/Column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`boolean`

## Example

```ts
const canSpan = column_getCanSpan(column)
```
