---
id: row_getLeafRows
title: row_getLeafRows
---

# Function: row\_getLeafRows()

```ts
function row_getLeafRows<TFeatures, TData>(row): Row<TFeatures, TData>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Returns

[`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>[]

## Defined in

[core/rows/Rows.utils.ts:62](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.utils.ts#L62)
