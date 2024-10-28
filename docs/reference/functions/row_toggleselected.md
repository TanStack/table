---
id: row_toggleSelected
title: row_toggleSelected
---

# Function: row\_toggleSelected()

```ts
function row_toggleSelected<TFeatures, TData>(
   row, 
   value?, 
   opts?): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

• **value?**: `boolean`

• **opts?**

• **opts.selectChildren?**: `boolean`

## Returns

`void`

## Defined in

[features/row-selection/RowSelection.utils.ts:243](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/RowSelection.utils.ts#L243)
