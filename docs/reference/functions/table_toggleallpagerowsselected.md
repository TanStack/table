---
id: table_toggleAllPageRowsSelected
title: table_toggleAllPageRowsSelected
---

# Function: table\_toggleAllPageRowsSelected()

```ts
function table_toggleAllPageRowsSelected<TFeatures, TData>(table, value?): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **value?**: `boolean`

## Returns

`void`

## Defined in

[features/row-selection/RowSelection.utils.ts:67](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/RowSelection.utils.ts#L67)
