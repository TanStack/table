---
id: column_getIsPinned
title: column_getIsPinned
---

# Function: column\_getIsPinned()

```ts
function column_getIsPinned<TFeatures, TData, TValue>(column): ColumnPinningPosition | false
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

[`ColumnPinningPosition`](../type-aliases/columnpinningposition.md) \| `false`

## Defined in

[features/column-pinning/ColumnPinning.utils.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.utils.ts#L86)
