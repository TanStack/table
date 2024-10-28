---
id: row_pin
title: row_pin
---

# Function: row\_pin()

```ts
function row_pin<TFeatures, TData>(
   row, 
   position, 
   includeLeafRows?, 
   includeParentRows?): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

• **position**: [`RowPinningPosition`](../type-aliases/rowpinningposition.md)

• **includeLeafRows?**: `boolean`

• **includeParentRows?**: `boolean`

## Returns

`void`

## Defined in

[features/row-pinning/RowPinning.utils.ts:151](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/RowPinning.utils.ts#L151)
