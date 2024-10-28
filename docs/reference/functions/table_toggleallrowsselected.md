---
id: table_toggleAllRowsSelected
title: table_toggleAllRowsSelected
---

# Function: table\_toggleAllRowsSelected()

```ts
function table_toggleAllRowsSelected<TFeatures, TData>(table, value?): void
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

[features/row-selection/RowSelection.utils.ts:36](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/RowSelection.utils.ts#L36)
