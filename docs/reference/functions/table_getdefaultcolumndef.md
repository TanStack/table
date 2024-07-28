---
id: table_getDefaultColumnDef
title: table_getDefaultColumnDef
---

# Function: table\_getDefaultColumnDef()

```ts
function table_getDefaultColumnDef<TFeatures, TData>(table): Partial<ColumnDef<TFeatures, TData, unknown>>
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`Partial`\<[`ColumnDef`](../type-aliases/columndef.md)\<`TFeatures`, `TData`, `unknown`\>\>

## Defined in

[core/columns/Columns.utils.ts:45](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/columns/Columns.utils.ts#L45)
