---
id: row_getCanExpand
title: row_getCanExpand
---

# Function: row\_getCanExpand()

```ts
function row_getCanExpand<TFeatures, TData>(row): boolean
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Defined in

[features/row-expanding/RowExpanding.utils.ts:169](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/RowExpanding.utils.ts#L169)
