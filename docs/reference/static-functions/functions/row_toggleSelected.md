---
id: row_toggleSelected
title: row_toggleSelected
---

# Function: row\_toggleSelected()

```ts
function row_toggleSelected<TFeatures, TData>(
   row, 
   value?, 
   opts?): void;
```

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:418](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L418)

Selects or deselects this row.

Omitting `value` toggles the row. Child rows are selected recursively unless
`opts.selectChildren` is `false` or sub-row selection is disabled.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

### value?

`boolean`

### opts?

#### selectChildren?

`boolean`

## Returns

`void`

## Example

```ts
row_toggleSelected(row)
```
