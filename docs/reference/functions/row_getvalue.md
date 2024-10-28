---
id: row_getValue
title: row_getValue
---

# Function: row\_getValue()

```ts
function row_getValue<TFeatures, TData>(row, columnId): unknown
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

• **columnId**: `string`

## Returns

`unknown`

## Defined in

[core/rows/Rows.utils.ts:9](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/Rows.utils.ts#L9)
