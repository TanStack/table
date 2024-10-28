---
id: column_pin
title: column_pin
---

# Function: column\_pin()

```ts
function column_pin<TFeatures, TData, TValue>(column, position): void
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **position**: [`ColumnPinningPosition`](../type-aliases/columnpinningposition.md)

## Returns

`void`

## Defined in

[features/column-pinning/ColumnPinning.utils.ts:29](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.utils.ts#L29)
