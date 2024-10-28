---
id: column_getAfter
title: column_getAfter
---

# Function: column\_getAfter()

```ts
function column_getAfter<TFeatures, TData, TValue>(column, position?): number
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **column**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>

• **position?**: `false` \| `"left"` \| `"right"` \| `"center"`

## Returns

`number`

## Defined in

[features/column-sizing/ColumnSizing.utils.ts:66](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/ColumnSizing.utils.ts#L66)
