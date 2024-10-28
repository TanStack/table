---
id: row_getAllCellsByColumnId
title: row_getAllCellsByColumnId
---

# Function: row\_getAllCellsByColumnId()

```ts
function row_getAllCellsByColumnId<TFeatures, TData>(row): Record<string, Cell<TFeatures, TData, unknown>>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Returns

`Record`\<`string`, [`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `unknown`\>\>

## Defined in

[core/rows/Rows.utils.ts:101](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.utils.ts#L101)
