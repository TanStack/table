---
id: header_getStart
title: header_getStart
---

# Function: header\_getStart()

```ts
function header_getStart<TFeatures, TData, TValue>(header): number
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

[features/column-sizing/ColumnSizing.utils.ts:109](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/ColumnSizing.utils.ts#L109)
