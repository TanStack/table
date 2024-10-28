---
id: table_getIsAllColumnsVisible
title: table_getIsAllColumnsVisible
---

# Function: table\_getIsAllColumnsVisible()

```ts
function table_getIsAllColumnsVisible<TFeatures, TData>(table): boolean
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Defined in

[features/column-visibility/ColumnVisibility.utils.ts:179](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.utils.ts#L179)
