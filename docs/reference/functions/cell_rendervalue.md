---
id: cell_renderValue
title: cell_renderValue
---

# Function: cell\_renderValue()

```ts
function cell_renderValue<TFeatures, TData, TValue>(cell): any
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **cell**: [`Cell`](../type-aliases/cell.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`any`

## Defined in

[core/cells/Cells.utils.ts:13](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/Cells.utils.ts#L13)
