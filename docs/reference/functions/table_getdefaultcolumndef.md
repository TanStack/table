---
id: table_getDefaultColumnDef
title: table_getDefaultColumnDef
---

# Function: table\_getDefaultColumnDef()

```ts
function table_getDefaultColumnDef<TFeatures, TData>(table): Partial<ColumnDef<TFeatures, TData, unknown>>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`Partial`\<[`ColumnDef`](../type-aliases/columndef.md)\<`TFeatures`, `TData`, `unknown`\>\>

## Defined in

[core/columns/Columns.utils.ts:41](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/Columns.utils.ts#L41)
