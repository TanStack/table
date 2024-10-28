---
id: header_getSize
title: header_getSize
---

# Function: header\_getSize()

```ts
function header_getSize<TFeatures, TData, TValue>(header): number
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **header**: [`Header`](../type-aliases/header.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`number`

## Defined in

[features/column-sizing/ColumnSizing.utils.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/ColumnSizing.utils.ts#L89)
