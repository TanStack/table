---
id: table_getIsSomeColumnsVisible
title: table_getIsSomeColumnsVisible
---

# Function: table\_getIsSomeColumnsVisible()

```ts
function table_getIsSomeColumnsVisible<TFeatures, TData>(table): boolean
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Defined in

[features/column-visibility/ColumnVisibility.utils.ts:188](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/ColumnVisibility.utils.ts#L188)
