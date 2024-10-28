---
id: table_getAllFlatColumnsById
title: table_getAllFlatColumnsById
---

# Function: table\_getAllFlatColumnsById()

```ts
function table_getAllFlatColumnsById<TFeatures, TData>(table): Record<string, Column<TFeatures, TData, unknown>>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`Record`\<`string`, [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\>\>

## Defined in

[core/columns/Columns.utils.ts:106](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/Columns.utils.ts#L106)
