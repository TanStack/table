---
id: buildHeaderGroups
title: buildHeaderGroups
---

# Function: buildHeaderGroups()

```ts
function buildHeaderGroups<TFeatures, TData, TValue>(
   allColumns, 
   columnsToGroup, 
   table, 
   headerFamily?): HeaderGroup<TFeatures, TData>[]
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* `unknown`

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **allColumns**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>[]

• **columnsToGroup**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>[]

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **headerFamily?**: `"left"` \| `"right"` \| `"center"`

## Returns

[`HeaderGroup`](../interfaces/headergroup.md)\<`TFeatures`, `TData`\>[]

## Defined in

[core/headers/buildHeaderGroups.ts:10](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/core/headers/buildHeaderGroups.ts#L10)
