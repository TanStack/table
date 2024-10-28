---
id: selectRowsFn
title: selectRowsFn
---

# Function: selectRowsFn()

```ts
function selectRowsFn<TFeatures, TData>(rowModel): RowModel<TFeatures, TData>
```

## Type Parameters

• **TFeatures** *extends* `Partial`\<`Record`\<`TableFeatureName`, [`TableFeature`](../interfaces/tablefeature.md)\>\>

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Parameters

• **rowModel**: [`RowModel`](../interfaces/rowmodel.md)\<`TFeatures`, `TData`\>

## Returns

[`RowModel`](../interfaces/rowmodel.md)\<`TFeatures`, `TData`\>

## Defined in

[features/row-selection/RowSelection.utils.ts:378](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-selection/RowSelection.utils.ts#L378)
