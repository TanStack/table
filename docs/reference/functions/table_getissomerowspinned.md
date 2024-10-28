---
id: table_getIsSomeRowsPinned
title: table_getIsSomeRowsPinned
---

# Function: table\_getIsSomeRowsPinned()

```ts
function table_getIsSomeRowsPinned<TFeatures, TData>(table, position?): boolean
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

• **position?**: [`RowPinningPosition`](../type-aliases/rowpinningposition.md)

## Returns

`boolean`

## Defined in

[features/row-pinning/RowPinning.utils.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/RowPinning.utils.ts#L41)
