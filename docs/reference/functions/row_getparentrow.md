---
id: row_getParentRow
title: row_getParentRow
---

# Function: row\_getParentRow()

```ts
function row_getParentRow<TFeatures, TData>(row): undefined | Row<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Returns

`undefined` \| [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Defined in

[core/rows/Rows.utils.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.utils.ts#L69)
