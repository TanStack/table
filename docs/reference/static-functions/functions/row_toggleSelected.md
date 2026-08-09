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

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:534](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L534)

Selects or deselects this row.

Omitting `value` toggles the row. Child rows are selected recursively unless
`opts.selectChildren` is `false`, sub-row selection is disabled, or the row
only supports single selection. Pass `deselectParents: true` to also remove
ancestor row ids from the selection when this row is deselected.

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

[`ToggleSelectedOptions`](../../index/interfaces/ToggleSelectedOptions.md)

## Returns

`void`

## Example

```ts
row_toggleSelected(row)
row_toggleSelected(row, true)
row_toggleSelected(row, false)
row_toggleSelected(row, true, { selectChildren: false })
row_toggleSelected(row, false, { deselectParents: true })
```
