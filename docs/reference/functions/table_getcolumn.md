---
id: table_getColumn
title: table_getColumn
---

# Function: table\_getColumn()

```ts
function table_getColumn<TFeatures, TData>(table, columnId): Column<TFeatures, TData, unknown> | undefined
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **columnId**: `string`

## Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\> \| `undefined`

## Defined in

[core/columns/Columns.utils.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/Columns.utils.ts#L131)
