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

Defined in: [packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts:241](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/rowSelectionFeature.utils.ts#L241)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

### value?

`boolean`

### opts?

#### selectChildren?

`boolean`

## Returns

`void`
