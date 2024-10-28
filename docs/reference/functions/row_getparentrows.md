---
id: row_getParentRows
title: row_getParentRows
---

# Function: row\_getParentRows()

```ts
function row_getParentRows<TFeatures, TData>(row): Row<TFeatures, TData>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Returns

[`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>[]

## Defined in

[core/rows/Rows.utils.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.utils.ts#L76)
