---
id: table_toggleAllColumnsVisible
title: table_toggleAllColumnsVisible
---

# Function: table\_toggleAllColumnsVisible()

```ts
function table_toggleAllColumnsVisible<TFeatures, TData>(table, value?): void
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

[features/column-visibility/ColumnVisibility.utils.ts:161](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.utils.ts#L161)
