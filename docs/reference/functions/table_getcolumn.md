---
id: table_getColumn
title: table_getColumn
---

# Function: table\_getColumn()

```ts
function table_getColumn<TFeatures, TData>(table, columnId): Column<TFeatures, TData, unknown> | undefined
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **columnId**: `string`

## Returns

[`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `unknown`\> \| `undefined`

## Defined in

[core/columns/Columns.utils.ts:137](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/columns/Columns.utils.ts#L137)
