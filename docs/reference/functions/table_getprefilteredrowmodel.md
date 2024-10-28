---
id: table_getPreFilteredRowModel
title: table_getPreFilteredRowModel
---

# Function: table\_getPreFilteredRowModel()

```ts
function table_getPreFilteredRowModel<TFeatures, TData>(table): RowModel<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **table**: [`Table_Internal`](../type-aliases/table_internal.md)\<`TFeatures`, `TData`\>

## Returns

[`RowModel`](../interfaces/rowmodel.md)\<`TFeatures`, `TData`\>

## Defined in

[core/row-models/RowModels.utils.ts:27](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/RowModels.utils.ts#L27)
