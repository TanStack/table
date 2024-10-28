---
id: column_getIsFirstColumn
title: column_getIsFirstColumn
---

# Function: column\_getIsFirstColumn()

```ts
function column_getIsFirstColumn<TFeatures, TData, TValue>(column, position?): boolean
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **position?**: [`ColumnPinningPosition`](../type-aliases/columnpinningposition.md) \| `"center"`

## Returns

`boolean`

## Defined in

[features/column-ordering/ColumnOrdering.utils.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-ordering/ColumnOrdering.utils.ts#L26)
