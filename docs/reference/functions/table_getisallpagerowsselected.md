---
id: table_getIsAllPageRowsSelected
title: table_getIsAllPageRowsSelected
---

# Function: table\_getIsAllPageRowsSelected()

```ts
function table_getIsAllPageRowsSelected<TFeatures, TData>(table): boolean
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Defined in

[features/row-selection/RowSelection.utils.ts:170](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/RowSelection.utils.ts#L170)
