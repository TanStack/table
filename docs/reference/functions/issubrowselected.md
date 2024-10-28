---
id: isSubRowSelected
title: isSubRowSelected
---

# Function: isSubRowSelected()

```ts
function isSubRowSelected<TFeatures, TData>(row): boolean | "some" | "all"
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **row**: [`Row`](../type-aliases/row.md)\<`TFeatures`, `TData`\>

## Returns

`boolean` \| `"some"` \| `"all"`

## Defined in

[features/row-selection/RowSelection.utils.ts:431](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/RowSelection.utils.ts#L431)
