---
id: table_getPreSelectedRowModel
title: table_getPreSelectedRowModel
---

# Function: table\_getPreSelectedRowModel()

```ts
function table_getPreSelectedRowModel<TFeatures, TData>(table): RowModel<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

[`RowModel`](../interfaces/rowmodel.md)\<`TFeatures`, `TData`\>

## Defined in

[features/row-selection/RowSelection.utils.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/RowSelection.utils.ts#L87)
