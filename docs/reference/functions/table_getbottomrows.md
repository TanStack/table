---
id: table_getBottomRows
title: table_getBottomRows
---

# Function: table\_getBottomRows()

```ts
function table_getBottomRows<TFeatures, TData>(table): Row<TFeatures, TData>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

[`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>[]

## Defined in

[features/row-pinning/RowPinning.utils.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/RowPinning.utils.ts#L89)
