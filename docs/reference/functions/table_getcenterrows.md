---
id: table_getCenterRows
title: table_getCenterRows
---

# Function: table\_getCenterRows()

```ts
function table_getCenterRows<TFeatures, TData>(table): Row<TFeatures, TData>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

[`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>[]

## Defined in

[features/row-pinning/RowPinning.utils.ts:96](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/RowPinning.utils.ts#L96)
