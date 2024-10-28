---
id: row_getCanMultiSelect
title: row_getCanMultiSelect
---

# Function: row\_getCanMultiSelect()

```ts
function row_getCanMultiSelect<TFeatures, TData>(row): boolean
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Defined in

[features/row-selection/RowSelection.utils.ts:321](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/RowSelection.utils.ts#L321)
