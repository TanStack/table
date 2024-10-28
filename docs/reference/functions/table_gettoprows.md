---
id: table_getTopRows
title: table_getTopRows
---

# Function: table\_getTopRows()

```ts
function table_getTopRows<TFeatures, TData>(table): Row<TFeatures, TData>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

[`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>[]

## Defined in

[features/row-pinning/RowPinning.utils.ts:82](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/RowPinning.utils.ts#L82)
