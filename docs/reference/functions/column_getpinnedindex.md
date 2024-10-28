---
id: column_getPinnedIndex
title: column_getPinnedIndex
---

# Function: column\_getPinnedIndex()

```ts
function column_getPinnedIndex<TFeatures, TData, TValue>(column): number
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`number`

## Defined in

[features/column-pinning/ColumnPinning.utils.ts:102](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.utils.ts#L102)
