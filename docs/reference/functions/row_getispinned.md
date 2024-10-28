---
id: row_getIsPinned
title: row_getIsPinned
---

# Function: row\_getIsPinned()

```ts
function row_getIsPinned<TFeatures, TData>(row): RowPinningPosition
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Returns

[`RowPinningPosition`](../type-aliases/rowpinningposition.md)

## Defined in

[features/row-pinning/RowPinning.utils.ts:121](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/RowPinning.utils.ts#L121)
