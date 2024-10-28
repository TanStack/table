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

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

• **TValue** *extends* `unknown` = `unknown`

## Parameters

• **allColumns**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>[]

• **columnsToGroup**: [`Column`](../type-aliases/column.md)\<`TFeatures`, `TData`, `TValue`\>[]

• **table**: [`Table`](../type-aliases/table.md)\<`TFeatures`, `TData`\>

• **headerFamily?**: `"left"` \| `"right"` \| `"center"`

## Returns

[`HeaderGroup`](../interfaces/headergroup.md)\<`TFeatures`, `TData`\>[]

## Defined in

[core/headers/buildHeaderGroups.ts:10](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/buildHeaderGroups.ts#L10)
