---
id: column_getIndex
title: column_getIndex
---

# Function: column\_getIndex()

```ts
function column_getIndex<TFeatures, TData, TValue>(column, position?): number
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **position?**: [`ColumnPinningPosition`](../type-aliases/columnpinningposition.md) \| `"center"`

## Returns

`number`

## Defined in

[features/column-ordering/ColumnOrdering.utils.ts:14](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/ColumnOrdering.utils.ts#L14)
