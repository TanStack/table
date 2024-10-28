---
id: row_renderValue
title: row_renderValue
---

# Function: row\_renderValue()

```ts
function row_renderValue<TFeatures, TData>(row, columnId): any
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

• **columnId**: `string`

## Returns

`any`

## Defined in

[core/rows/Rows.utils.ts:55](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.utils.ts#L55)
