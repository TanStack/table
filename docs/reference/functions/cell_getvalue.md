---
id: cell_getValue
title: cell_getValue
---

# Function: cell\_getValue()

```ts
function cell_getValue<TFeatures, TData, TValue>(cell): TValue
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **cell**: [`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`TValue`

## Defined in

[core/cells/Cells.utils.ts:5](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/Cells.utils.ts#L5)
