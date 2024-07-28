---
id: cell_getValue
title: cell_getValue
---

# Function: cell\_getValue()

```ts
function cell_getValue<TFeatures, TData, TValue>(cell, table): TValue
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **cell**: [`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `TValue`\>

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

## Returns

`TValue`

## Defined in

[core/cells/Cells.utils.ts:7](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/cells/Cells.utils.ts#L7)
