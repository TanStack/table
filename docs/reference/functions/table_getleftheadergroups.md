---
id: table_getLeftHeaderGroups
title: table_getLeftHeaderGroups
---

# Function: table\_getLeftHeaderGroups()

```ts
function table_getLeftHeaderGroups<TFeatures, TData>(table): HeaderGroup<TFeatures, TData>[]
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

[`HeaderGroup`](../interfaces/headergroup.md)\<`TFeatures`, `TData`\>[]

## Defined in

[features/column-pinning/ColumnPinning.utils.ts:198](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/ColumnPinning.utils.ts#L198)
