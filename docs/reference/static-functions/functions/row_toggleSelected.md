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

Defined in: [features/row-selection/rowSelectionFeature.utils.ts:403](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L403)

Toggles selected for a row.

The update is routed through the table state updater for the owning feature state slice.

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
