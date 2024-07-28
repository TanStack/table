---
id: isRowSelected
title: isRowSelected
---

# Function: isRowSelected()

```ts
function isRowSelected<TFeatures, TData>(row, selection): boolean
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

• **selection**: `Record`\<`string`, `boolean`\>

## Returns

`boolean`

## Defined in

[features/row-selection/RowSelection.utils.ts:685](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/row-selection/RowSelection.utils.ts#L685)
